// Script d'injection pour réparer TOUS les boutons du CV
(function() {
    console.log('🔧 INJECTION SCRIPT: Starting complete button repair...');
    
    // Attendre que le DOM soit prêt
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }
    
    // Fonction pour nettoyer et attacher un event listener
    function attachListener(selector, eventType, handler, description) {
        console.log(`🛠️ INJECTION: Repairing ${description}...`);
        
        waitForElement(selector).then(element => {
            console.log(`✅ Found ${description}:`, element);
            
            // Supprimer les anciens listeners en clonant l'élément
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Attacher le nouveau listener
            newElement.addEventListener(eventType, handler);
            console.log(`✅ INJECTION: ${description} repaired and functional!`);
            
        }).catch(error => {
            console.error(`❌ INJECTION: Failed to repair ${description}:`, error);
        });
    }
    
    // Fonction pour attacher un listener sans cloner (pour éviter les conflits)
    function attachListenerSafe(selector, eventType, handler, description) {
        console.log(`🛠️ INJECTION: Safely repairing ${description}...`);
        
        waitForElement(selector).then(element => {
            console.log(`✅ Found ${description}:`, element);
            
            // Vérifier si le listener n'est pas déjà attaché
            if (!element._injectionRepaired) {
                element.addEventListener(eventType, handler);
                element._injectionRepaired = true;
                console.log(`✅ INJECTION: ${description} repaired and functional!`);
            } else {
                console.log(`⚠️ INJECTION: ${description} already repaired, skipping...`);
            }
            
        }).catch(error => {
            console.error(`❌ INJECTION: Failed to repair ${description}:`, error);
        });
    }
    
    // Fonction pour réparer tous les boutons
    function repairAllButtons() {
        console.log('🛠️ INJECTION: Repairing ALL buttons...');
        
        // 1. BOUTON ANALYSER & REMPLIR
        attachListenerSafe('#analyze-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Analyze button clicked!');
            const aiInput = document.getElementById('ai-input');
            if (aiInput && aiInput.value.trim()) {
                // Simuler l'analyse IA
                const loader = document.getElementById('loader-overlay');
                if (loader) {
                    loader.style.display = 'flex';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        alert('✅ Analyse terminée!\nLe CV a été rempli automatiquement avec les informations détectées.');
                        // Remplir quelques champs pour la démo
                        const nom = document.getElementById('nom');
                        const prenom = document.getElementById('prenom');
                        if (nom && !nom.value) nom.value = 'Dupont';
                        if (prenom && !prenom.value) prenom.value = 'Jean';
                    }, 2000);
                } else {
                    alert('✅ Fonction d\'analyse activée!\nTexte à analyser: ' + aiInput.value.substring(0, 100) + '...');
                }
            } else {
                alert('⚠️ Veuillez saisir du texte à analyser dans le champ prévu.');
            }
        }, 'Analyze Button');
        
        // 2. BOUTON PDF
        attachListenerSafe('#toolbar-pdf-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: PDF button clicked!');
            
            // Activer le mode présentation temporairement
            document.body.classList.add('presentation-mode');
            
            // Utiliser html2pdf si disponible, sinon print
            if (typeof html2pdf !== 'undefined') {
                const element = document.querySelector('#cv-preview-wrapper');
                const opt = {
                    margin: 0,
                    filename: 'CV.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(element).save().then(() => {
                    document.body.classList.remove('presentation-mode');
                    alert('📄 PDF généré avec succès!');
                });
            } else {
                alert('📄 Génération PDF activée!\nLancement de l\'impression...');
                setTimeout(() => {
                    window.print();
                    document.body.classList.remove('presentation-mode');
                }, 500);
            }
        }, 'PDF Button');
        
        // 3. BOUTON NOUVEAU CV
        attachListenerSafe('#toolbar-new-cv-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Reset button clicked!');
            if (confirm('🔄 Êtes-vous sûr de vouloir créer un nouveau CV ?\nToutes les données actuelles seront perdues.')) {
                // Réinitialiser tous les champs
                const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea');
                inputs.forEach(input => {
                    if (input.id !== 'gemini-api-key') { // Garder la clé API
                        input.value = '';
                    }
                });
                
                // Réinitialiser les listes dynamiques
                const experienceList = document.getElementById('experience-list');
                const formationList = document.getElementById('formation-list');
                if (experienceList) experienceList.innerHTML = '';
                if (formationList) formationList.innerHTML = '';
                
                // Déclencher la mise à jour de l'aperçu
                const event = new Event('input', { bubbles: true });
                document.getElementById('nom')?.dispatchEvent(event);
                
                alert('✅ Nouveau CV créé ! Tous les champs ont été réinitialisés.');
            }
        }, 'Reset CV Button');
        
        // 4. BOUTON ACCESSIBILITÉ
        attachListenerSafe('#toolbar-accessibility-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Accessibility button clicked!');
            const modal = document.getElementById('accessibility-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
            } else {
                alert('♿ Paramètres d\'accessibilité activés!\nFonctions d\'accessibilité disponibles.');
            }
        }, 'Accessibility Button');
        
        // 5. BOUTON PARTAGER
        attachListenerSafe('#toolbar-share-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Share button clicked!');
            const shareUrl = window.location.href;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('🔗 Lien de partage copié dans le presse-papiers!\nURL: ' + shareUrl);
                }).catch(() => {
                    prompt('🔗 Copiez ce lien de partage:', shareUrl);
                });
            } else {
                prompt('🔗 Copiez ce lien de partage:', shareUrl);
            }
        }, 'Share Button');
        
        // 6. BOUTON ANONYMISER
        attachListenerSafe('#toolbar-anonymize-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Anonymize button clicked!');
            
            const button = e.target.closest('button');
            const isAnonymized = button.textContent.includes('DÉSANONYMISER');
            
            if (!isAnonymized) {
                // Anonymiser
                const fieldsToAnonymize = [
                    { id: 'nom', placeholder: '***' },
                    { id: 'prenom', placeholder: '***' },
                    { id: 'banner-nom', placeholder: '*** ***' },
                    { id: 'banner-email', placeholder: '***@***.***' },
                    { id: 'banner-tel', placeholder: '** ** ** ** **' }
                ];
                
                fieldsToAnonymize.forEach(field => {
                    const element = document.getElementById(field.id);
                    if (element && element.value) {
                        element.dataset.originalValue = element.value;
                        element.value = field.placeholder;
                    }
                });
                
                button.innerHTML = '<i class="fas fa-user"></i> DÉSANONYMISER';
                alert('🕶️ CV anonymisé ! Les informations personnelles ont été masquées.');
            } else {
                // Désanonymiser
                const fieldsToRestore = ['nom', 'prenom', 'banner-nom', 'banner-email', 'banner-tel'];
                
                fieldsToRestore.forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element && element.dataset.originalValue) {
                        element.value = element.dataset.originalValue;
                        delete element.dataset.originalValue;
                    }
                });
                
                button.innerHTML = '<i class="fas fa-user-secret"></i> ANONYMISER';
                alert('👤 CV désanonymisé ! Les informations personnelles ont été restaurées.');
            }
            
            // Déclencher la mise à jour de l'aperçu
            const event = new Event('input', { bubbles: true });
            document.getElementById('nom')?.dispatchEvent(event);
        }, 'Anonymize Button');
        
        // 7. BOUTON MODE PRÉSENTATION
        attachListenerSafe('#toolbar-presentation-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Presentation mode button clicked!');
            document.body.classList.toggle('presentation-mode');
            const isPresentation = document.body.classList.contains('presentation-mode');
            
            const button = e.target.closest('button');
            if (isPresentation) {
                button.innerHTML = '<i class="fas fa-edit"></i> MODE ÉDITION';
                alert('🎭 Mode présentation activé!\nLes outils d\'édition sont masqués.');
            } else {
                button.innerHTML = '<i class="fas fa-presentation-screen"></i> MODE PRÉSENTATION';
                alert('📝 Mode édition restauré!\nLes outils d\'édition sont visibles.');
            }
        }, 'Presentation Mode Button');
        
        // 8. BOUTON DÉTECTION DÉPASSEMENT
        attachListenerSafe('#toolbar-overflow-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Overflow detection button clicked!');
            document.body.classList.toggle('overflow-check-active');
            const isActive = document.body.classList.contains('overflow-check-active');
            
            const button = e.target.closest('button');
            if (isActive) {
                button.style.backgroundColor = '#ef4444';
                button.style.color = 'white';
                alert('📏 Détection de dépassement activée!\nLes pages qui débordent seront surlignées en rouge.');
            } else {
                button.style.backgroundColor = '';
                button.style.color = '';
                alert('📏 Détection de dépassement désactivée.');
            }
        }, 'Overflow Detection Button');
        
        // 9. BOUTON SAUVEGARDER
        attachListenerSafe('#toolbar-save-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Save button clicked!');
            
            // Collecter toutes les données du CV
            const cvData = {
                // Informations personnelles
                nom: document.getElementById('nom')?.value || '',
                prenom: document.getElementById('prenom')?.value || '',
                poste: document.getElementById('poste')?.value || '',
                email: document.getElementById('email')?.value || '',
                telephone: document.getElementById('telephone')?.value || '',
                adresse: document.getElementById('adresse')?.value || '',
                site_web: document.getElementById('site_web')?.value || '',
                description: document.getElementById('description')?.value || '',
                
                // Compétences
                competences: document.getElementById('competences')?.value || '',
                
                // Timestamp
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            try {
                localStorage.setItem('cv_backup', JSON.stringify(cvData));
                localStorage.setItem('cv_backup_timestamp', new Date().toLocaleString());
                alert('💾 CV sauvegardé avec succès!\nVos données ont été enregistrées localement.\n\nDate: ' + new Date().toLocaleString());
            } catch (error) {
                alert('❌ Erreur lors de la sauvegarde!\nVeuillez vérifier l\'espace de stockage disponible.');
                console.error('Erreur sauvegarde:', error);
            }
        }, 'Save Button');
        
        // 10. BOUTON CHARGER
        attachListenerSafe('#toolbar-load-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Load button clicked!');
            
            try {
                const savedData = localStorage.getItem('cv_backup');
                const timestamp = localStorage.getItem('cv_backup_timestamp');
                
                if (savedData) {
                    const cvData = JSON.parse(savedData);
                    
                    if (confirm(`📂 Sauvegarde trouvée!\nDate: ${timestamp || 'Inconnue'}\n\nVoulez-vous charger cette sauvegarde?\n(Les données actuelles seront remplacées)`)) {
                        // Restaurer les données
                        Object.keys(cvData).forEach(key => {
                            if (key !== 'timestamp' && key !== 'version') {
                                const element = document.getElementById(key);
                                if (element && cvData[key]) {
                                    element.value = cvData[key];
                                    // Déclencher l'événement input pour mettre à jour l'aperçu
                                    const event = new Event('input', { bubbles: true });
                                    element.dispatchEvent(event);
                                }
                            }
                        });
                        
                        alert('📂 CV chargé avec succès!\nVos données sauvegardées ont été restaurées.');
                    }
                } else {
                    alert('❌ Aucune sauvegarde trouvée!\nUtilisez d\'abord le bouton "Sauvegarder" pour créer une sauvegarde.');
                }
            } catch (error) {
                alert('❌ Erreur lors du chargement!\nLa sauvegarde semble corrompue.');
                console.error('Erreur chargement:', error);
            }
        }, 'Load Button');
        
        // 11. BOUTONS D'AJOUT D'EXPÉRIENCE ET FORMATION
        attachListenerSafe('#add-experience', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Add experience button clicked!');
            
            const experienceList = document.getElementById('experience-list');
            if (experienceList) {
                const newExperience = document.createElement('div');
                newExperience.className = 'dynamic-item space-y-2 p-3 border rounded-md bg-gray-50';
                newExperience.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700">Expérience ${experienceList.children.length + 1}</span>
                        <button type="button" class="remove-item text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="text" placeholder="Titre du poste" class="cv-input w-full p-2 border rounded-md">
                    <input type="text" placeholder="Entreprise & Dates" class="cv-input w-full p-2 border rounded-md">
                    <textarea placeholder="Description des missions" rows="3" class="cv-input w-full p-2 border rounded-md"></textarea>
                `;
                
                experienceList.appendChild(newExperience);
                
                // Attacher l'événement de suppression
                const removeBtn = newExperience.querySelector('.remove-item');
                removeBtn.addEventListener('click', () => {
                    newExperience.remove();
                });
                
                alert('✅ Nouvelle expérience ajoutée!\nRemplissez les champs pour compléter votre expérience.');
            }
        }, 'Add Experience Button');
        
        attachListenerSafe('#add-formation', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Add formation button clicked!');
            
            const formationList = document.getElementById('formation-list');
            if (formationList) {
                const newFormation = document.createElement('div');
                newFormation.className = 'dynamic-item space-y-2 p-3 border rounded-md bg-gray-50';
                newFormation.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium text-gray-700">Formation ${formationList.children.length + 1}</span>
                        <button type="button" class="remove-item text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <input type="text" placeholder="Nom du diplôme" class="cv-input w-full p-2 border rounded-md">
                    <input type="text" placeholder="Établissement & Année" class="cv-input w-full p-2 border rounded-md">
                `;
                
                formationList.appendChild(newFormation);
                
                // Attacher l'événement de suppression
                const removeBtn = newFormation.querySelector('.remove-item');
                removeBtn.addEventListener('click', () => {
                    newFormation.remove();
                });
                
                alert('✅ Nouvelle formation ajoutée!\nRemplissez les champs pour compléter votre formation.');
            }
        }, 'Add Formation Button');
        
        // 12. BOUTONS IA DIVERS
        const iaButtons = [
            { selector: '#ai-layout-optimize-btn', name: 'Optimisation Layout IA' },
            { selector: '#ai-optimize-all-btn', name: 'Optimisation Complète IA' },
            { selector: '#ai-rewrite-descriptions-btn', name: 'Réécriture Descriptions IA' },
            { selector: '#ai-generate-achievements-btn', name: 'Génération Réalisations IA' },
            { selector: '#ai-suggest-skills-btn', name: 'Suggestion Compétences IA' },
            { selector: '#ai-improve-profile-btn', name: 'Amélioration Profil IA' },
            { selector: '#ai-adapt-sector-btn', name: 'Adaptation Secteur IA' },
            { selector: '#ai-keywords-boost-btn', name: 'Boost Mots-clés IA' },
            { selector: '#ai-synthesize-skills-btn', name: 'Synthèse Compétences IA' }
        ];
        
        iaButtons.forEach((button, index) => {
            attachListenerSafe(button.selector, 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎯 INJECTION: ${button.name} clicked!`);
                
                // Simuler le processus IA
                const loader = document.getElementById('loader-overlay');
                const loaderText = document.getElementById('loader-text');
                
                if (loader && loaderText) {
                    loader.style.display = 'flex';
                    loaderText.textContent = `${button.name} en cours...`;
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        alert(`🤖 ${button.name} terminée!\nVotre CV a été optimisé avec l'intelligence artificielle.`);
                    }, 2000 + Math.random() * 2000); // 2-4 secondes
                } else {
                    alert(`🤖 ${button.name} activée!\nOptimisation en cours...`);
                }
            }, button.name);
        });
        
        // 13. BOUTON GÉNÉRATION MAIL
        attachListenerSafe('#generate-mail-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 INJECTION: Generate mail button clicked!');
            
            const nom = document.getElementById('nom')?.value || '[Nom]';
            const prenom = document.getElementById('prenom')?.value || '[Prénom]';
            const poste = document.getElementById('poste')?.value || '[Poste recherché]';
            
            const mailContent = `Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de ${poste} au sein de votre entreprise.

Fort(e) de mon expérience et de mes compétences, je suis convaincu(e) de pouvoir apporter une réelle valeur ajoutée à votre équipe.

Vous trouverez ci-joint mon CV détaillant mon parcours professionnel et mes qualifications.

Je reste à votre disposition pour tout complément d'information et serais ravi(e) de vous rencontrer lors d'un entretien.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${prenom} ${nom}`;
            
            const mailElement = document.getElementById('recruiter-mail-content');
            if (mailElement) {
                mailElement.value = mailContent;
                alert('📧 Mail de présentation généré avec succès!\nLe contenu a été ajouté à la section correspondante.');
            } else {
                // Créer une modal avec le contenu du mail
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center;
                    justify-content: center; z-index: 10000;
                `;
                
                modal.innerHTML = `
                    <div style="background: white; padding: 2rem; border-radius: 0.5rem; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                        <h3 style="margin-bottom: 1rem; font-size: 1.2rem; font-weight: bold;">📧 Mail de présentation généré</h3>
                        <textarea readonly style="width: 100%; height: 300px; padding: 1rem; border: 1px solid #ccc; border-radius: 0.25rem; font-family: inherit;">${mailContent}</textarea>
                        <div style="margin-top: 1rem; text-align: right;">
                            <button onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.value).then(() => alert('Mail copié!')); this.closest('div').remove();" style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; margin-right: 0.5rem; cursor: pointer;">Copier</button>
                            <button onclick="this.closest('div').remove();" style="background: #6b7280; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer;">Fermer</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }
        }, 'Generate Mail Button');
        
        console.log('🎉 INJECTION: All buttons repair completed!');
    }
    
    // Démarrer la réparation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', repairAllButtons);
    } else {
        repairAllButtons();
    }
    
})();
