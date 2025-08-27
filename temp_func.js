            async function callGeminiAPI(prompt, schema) {
                console.log("=== APPEL API GEMINI ===");
                
                const apiKey = getCurrentApiKey();
                console.log("ClÃ© API prÃ©sente:", !!apiKey);
                console.log("Longueur clÃ© API:", apiKey.length);
                
                // Lancer l'animation Matrix au lieu du loader
                showMatrixProcessing();
                try {
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
                    
                    const payload = {
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                        generationConfig: schema ? { responseMimeType: "application/json", responseSchema: schema } : {}
                    };

                    console.log("URL API:", apiUrl.substring(0, 100) + "...");
                    console.log("Payload:", payload);

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    console.log("Status de la rÃ©ponse:", response.status);
                    console.log("Headers de la rÃ©ponse:", Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        const errorBody = await response.text();
                        console.error("âŒ Erreur API dÃ©taillÃ©e:", errorBody);
                        
                        if (response.status === 400) {
                            if (errorBody.includes('API_KEY_INVALID') || errorBody.includes('INVALID_API_KEY')) {
                                showNotification("ðŸ”‘ ClÃ© API Gemini invalide ! VÃ©rifiez votre clÃ© dans la barre d'outils.", "error", 6000);
                                controls.geminiApiKey.style.animation = 'pulse 1s ease-in-out 3';
                                throw new Error("ClÃ© API invalide");
                            } else if (errorBody.includes('API_KEY_EXPIRED')) {
                                showNotification("â° ClÃ© API Gemini expirÃ©e ! Renouvelez votre clÃ©.", "error", 6000);
                                throw new Error("ClÃ© API expirÃ©e");
                            } else if (errorBody.includes('QUOTA_EXCEEDED')) {
                                showNotification("ðŸ“Š Quota API Gemini dÃ©passÃ© ! Attendez ou changez de clÃ©.", "error", 6000);
                                throw new Error("Quota dÃ©passÃ©");
                            }
                        } else if (response.status === 403) {
                            showNotification("ðŸš« AccÃ¨s interdit Ã  l'API Gemini. VÃ©rifiez vos permissions.", "error", 6000);
                            throw new Error("AccÃ¨s interdit");
                        } else if (response.status === 429) {
                            showNotification("âš¡ Trop de requÃªtes Ã  l'API Gemini. Ralentissez.", "error", 6000);
                            throw new Error("Trop de requÃªtes");
                        }
                        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();
                    console.log("âœ… RÃ©ponse API complÃ¨te:", result);
                    
                    // VÃ©rification de la structure de la rÃ©ponse
                    if (!result) {
                        console.error("âŒ ERREUR: RÃ©ponse API vide");
                        throw new Error("RÃ©ponse API vide");
                    }
                    
                    if (!result.candidates || result.candidates.length === 0) {
                        console.error("âŒ ERREUR: Aucun candidat dans la rÃ©ponse API");
                        console.log("Structure de la rÃ©ponse:", result);
                        throw new Error("Aucune rÃ©ponse gÃ©nÃ©rÃ©e par l'IA");
                    }
                    
                    const candidate = result.candidates[0];
                    console.log("ðŸ“‹ Premier candidat:", candidate);
                    
                    if (candidate.finishReason && candidate.finishReason !== "STOP" && candidate.finishReason !== "MAX_TOKENS") {
                        console.error("âŒ IA bloquÃ©e, raison:", candidate.finishReason);
                        throw new Error(`L'IA a Ã©tÃ© bloquÃ©e (raison: ${candidate.finishReason}). Veuillez reformuler votre demande.`);
                    }
                    
                    if (!candidate.content) {
                        console.error("âŒ ERREUR: Aucun contenu dans le candidat");
                        console.log("Candidat complet:", candidate);
                        throw new Error("Aucun contenu gÃ©nÃ©rÃ© par l'IA");
                    }
                    
                    if (!candidate.content.parts || candidate.content.parts.length === 0) {
                        console.error("âŒ ERREUR: Aucune partie dans le contenu");
                        console.log("Contenu complet:", candidate.content);
                        throw new Error("Contenu IA vide");
                    }
                    
                    const text = candidate.content.parts[0].text;
                    console.log("ðŸ“ Texte brut reÃ§u de l'IA (longueur: " + (text ? text.length : 0) + "):", text);
                    
                    if (!text || text.trim() === '') {
                        console.error("âŒ ERREUR: Texte vide reÃ§u de l'IA");
                        throw new Error("Texte gÃ©nÃ©rÃ© vide");
                    }
                    
                    if (schema) {
                        // Nettoyer et parser le JSON de maniÃ¨re robuste
                        return parseAIJsonSafely(text);
                    } else {
                        return text;
                    }

                } catch (error) {
                    console.error("âŒ Erreur dÃ©taillÃ©e de l'IA:", error);
                    showNotification(`Erreur de l'IA : ${error.message}`, 'error', 5000);
                    throw error;
                } finally {
                    hideMatrixProcessing();
                }
            }
        }
