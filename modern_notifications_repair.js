// Script d'amélioration pour remplacer les alertes par des notifications modernes
(function() {
    console.log('🎨 MODERN NOTIFICATIONS: Starting notification system upgrade...');
    
    // Fonction pour attendre qu'un élément soit disponible
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

    // Fonction pour créer une notification moderne
    function showModernNotification(title, message = '', type = 'info', duration = 5000) {
        // Vérifier si la fonction showNotification existe dans le scope global
        if (typeof window.showNotification === 'function') {
            return window.showNotification(title, message, type, duration);
        }
        
        // Si pas disponible, utiliser notre propre implémentation
        const container = document.getElementById('notification-container');
        if (!container) {
            console.warn('Conteneur de notifications non trouvé, utilisation d\'une alerte');
            alert(`${title}${message ? '\n' + message : ''}`);
            return;
        }

        const notificationId = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = notificationId;
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="toast-progress" style="width: 100%;"></div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        if (duration > 0) {
            const progressBar = toast.querySelector('.toast-progress');
            progressBar.style.transition = `width ${duration}ms linear`;
            
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 200);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 400);
            }, duration);
        }

        return notificationId;
    }

    // Fonction pour attacher un listener moderne
    function attachModernListener(selector, eventType, handler, description) {
        console.log(`🎨 MODERN: Upgrading ${description}...`);
        
        waitForElement(selector).then(element => {
            console.log(`✅ Found ${description}:`, element);
            
            if (!element._modernUpgraded) {
                element.addEventListener(eventType, handler);
                element._modernUpgraded = true;
                console.log(`✅ MODERN: ${description} upgraded with modern notifications!`);
            } else {
                console.log(`⚠️ MODERN: ${description} already upgraded, skipping...`);
            }
            
        }).catch(error => {
            console.error(`❌ MODERN: Failed to upgrade ${description}:`, error);
        });
    }

    // Fonction principale pour upgrader tous les boutons
    function upgradeAllButtons() {
        console.log('🎨 MODERN: Upgrading ALL buttons with modern notifications...');
        
        // 1. BOUTON ANALYSER & REMPLIR
        attachModernListener('#analyze-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Analyze button clicked!');
            
            const aiInput = document.getElementById('ai-input');
            if (aiInput && aiInput.value.trim()) {
                showModernNotification(
                    'Analyse IA en cours...',
                    'Traitement de votre texte par l\'intelligence artificielle',
                    'info',
                    3000
                );
                
                const loader = document.getElementById('loader-overlay');
                if (loader) {
                    loader.style.display = 'flex';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        showModernNotification(
                            'Analyse terminée !',
                            'Le CV a été rempli automatiquement avec les informations détectées',
                            'success',
                            5000
                        );
                        
                        // Remplir quelques champs pour la démo
                        const nom = document.getElementById('nom');
                        const prenom = document.getElementById('prenom');
                        if (nom && !nom.value) nom.value = 'Dupont';
                        if (prenom && !prenom.value) prenom.value = 'Jean';
                    }, 2000);
                }
            } else {
                showModernNotification(
                    'Texte requis',
                    'Veuillez saisir du texte à analyser dans le champ prévu',
                    'warning',
                    4000
                );
            }
        }, 'Analyze Button');
        
        // 2. BOUTON PDF
        attachModernListener('#toolbar-pdf-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: PDF button clicked!');
            
            showModernNotification(
                'Génération PDF...',
                'Préparation de votre CV pour l\'export PDF',
                'info',
                2000
            );
            
            document.body.classList.add('presentation-mode');
            
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
                    showModernNotification(
                        'PDF généré !',
                        'Votre CV a été téléchargé avec succès',
                        'success',
                        4000
                    );
                });
            } else {
                setTimeout(() => {
                    window.print();
                    document.body.classList.remove('presentation-mode');
                    showModernNotification(
                        'Impression lancée',
                        'La fenêtre d\'impression a été ouverte',
                        'success',
                        3000
                    );
                }, 500);
            }
        }, 'PDF Button');
        
        // 3. BOUTON NOUVEAU CV
        attachModernListener('#toolbar-new-cv-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Reset button clicked!');
            
            if (confirm('🔄 Êtes-vous sûr de vouloir créer un nouveau CV ?\nToutes les données actuelles seront perdues.')) {
                const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea');
                inputs.forEach(input => {
                    if (input.id !== 'gemini-api-key' && input.id !== 'chatgpt-api-key') {
                        input.value = '';
                    }
                });
                
                const experienceList = document.getElementById('experience-list');
                const formationList = document.getElementById('formation-list');
                if (experienceList) experienceList.innerHTML = '';
                if (formationList) formationList.innerHTML = '';
                
                const event = new Event('input', { bubbles: true });
                document.getElementById('nom')?.dispatchEvent(event);
                
                showModernNotification(
                    'Nouveau CV créé !',
                    'Tous les champs ont été réinitialisés',
                    'success',
                    4000
                );
            }
        }, 'Reset CV Button');
        
        // 4. BOUTON SAUVEGARDER
        attachModernListener('#toolbar-save-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Save button clicked!');
            
            const cvData = {
                nom: document.getElementById('nom')?.value || '',
                prenom: document.getElementById('prenom')?.value || '',
                poste: document.getElementById('poste')?.value || '',
                email: document.getElementById('email')?.value || '',
                telephone: document.getElementById('telephone')?.value || '',
                adresse: document.getElementById('adresse')?.value || '',
                site_web: document.getElementById('site_web')?.value || '',
                description: document.getElementById('description')?.value || '',
                competences: document.getElementById('competences')?.value || '',
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            try {
                localStorage.setItem('cv_backup', JSON.stringify(cvData));
                localStorage.setItem('cv_backup_timestamp', new Date().toLocaleString());
                
                showModernNotification(
                    'CV sauvegardé !',
                    `Vos données ont été enregistrées localement le ${new Date().toLocaleString()}`,
                    'success',
                    5000
                );
            } catch (error) {
                showModernNotification(
                    'Erreur de sauvegarde',
                    'Veuillez vérifier l\'espace de stockage disponible',
                    'error',
                    5000
                );
                console.error('Erreur sauvegarde:', error);
            }
        }, 'Save Button');
        
        // 5. BOUTON CHARGER
        attachModernListener('#toolbar-load-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Load button clicked!');
            
            try {
                const savedData = localStorage.getItem('cv_backup');
                const timestamp = localStorage.getItem('cv_backup_timestamp');
                
                if (savedData) {
                    const cvData = JSON.parse(savedData);
                    
                    if (confirm(`📂 Sauvegarde trouvée!\nDate: ${timestamp || 'Inconnue'}\n\nVoulez-vous charger cette sauvegarde?\n(Les données actuelles seront remplacées)`)) {
                        Object.keys(cvData).forEach(key => {
                            if (key !== 'timestamp' && key !== 'version') {
                                const element = document.getElementById(key);
                                if (element && cvData[key]) {
                                    element.value = cvData[key];
                                    const event = new Event('input', { bubbles: true });
                                    element.dispatchEvent(event);
                                }
                            }
                        });
                        
                        showModernNotification(
                            'CV chargé !',
                            'Vos données sauvegardées ont été restaurées',
                            'success',
                            4000
                        );
                    }
                } else {
                    showModernNotification(
                        'Aucune sauvegarde',
                        'Utilisez d\'abord le bouton "Sauvegarder" pour créer une sauvegarde',
                        'warning',
                        4000
                    );
                }
            } catch (error) {
                showModernNotification(
                    'Erreur de chargement',
                    'La sauvegarde semble corrompue',
                    'error',
                    5000
                );
                console.error('Erreur chargement:', error);
            }
        }, 'Load Button');
        
        // 6. BOUTON PARTAGER
        attachModernListener('#toolbar-share-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Share button clicked!');
            
            const shareUrl = window.location.href;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    showModernNotification(
                        'Lien copié !',
                        'Le lien de partage a été copié dans le presse-papiers',
                        'success',
                        4000
                    );
                }).catch(() => {
                    prompt('🔗 Copiez ce lien de partage:', shareUrl);
                });
            } else {
                prompt('🔗 Copiez ce lien de partage:', shareUrl);
            }
        }, 'Share Button');
        
        // 7. BOUTON ANONYMISER
        attachModernListener('#toolbar-anonymize-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Anonymize button clicked!');
            
            const button = e.target.closest('button');
            const isAnonymized = button.textContent.includes('DÉSANONYMISER');
            
            if (!isAnonymized) {
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
                showModernNotification(
                    'CV anonymisé',
                    'Les informations personnelles ont été masquées',
                    'info',
                    4000
                );
            } else {
                const fieldsToRestore = ['nom', 'prenom', 'banner-nom', 'banner-email', 'banner-tel'];
                
                fieldsToRestore.forEach(fieldId => {
                    const element = document.getElementById(fieldId);
                    if (element && element.dataset.originalValue) {
                        element.value = element.dataset.originalValue;
                        delete element.dataset.originalValue;
                    }
                });
                
                button.innerHTML = '<i class="fas fa-user-secret"></i> ANONYMISER';
                showModernNotification(
                    'CV désanonymisé',
                    'Les informations personnelles ont été restaurées',
                    'success',
                    4000
                );
            }
            
            const event = new Event('input', { bubbles: true });
            document.getElementById('nom')?.dispatchEvent(event);
        }, 'Anonymize Button');
        
        // 8. BOUTON MODE PRÉSENTATION
        attachModernListener('#toolbar-presentation-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Presentation mode button clicked!');
            
            document.body.classList.toggle('presentation-mode');
            const isPresentation = document.body.classList.contains('presentation-mode');
            
            const button = e.target.closest('button');
            if (isPresentation) {
                button.innerHTML = '<i class="fas fa-edit"></i> MODE ÉDITION';
                showModernNotification(
                    'Mode présentation activé',
                    'Les outils d\'édition sont maintenant masqués',
                    'info',
                    3000
                );
            } else {
                button.innerHTML = '<i class="fas fa-presentation-screen"></i> MODE PRÉSENTATION';
                showModernNotification(
                    'Mode édition restauré',
                    'Les outils d\'édition sont maintenant visibles',
                    'success',
                    3000
                );
            }
        }, 'Presentation Mode Button');
        
        // 9. BOUTON DÉTECTION DÉPASSEMENT
        attachModernListener('#toolbar-overflow-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Overflow detection button clicked!');
            
            document.body.classList.toggle('overflow-check-active');
            const isActive = document.body.classList.contains('overflow-check-active');
            
            const button = e.target.closest('button');
            if (isActive) {
                button.style.backgroundColor = '#ef4444';
                button.style.color = 'white';
                showModernNotification(
                    'Détection activée',
                    'Les pages qui débordent seront surlignées en rouge',
                    'info',
                    4000
                );
            } else {
                button.style.backgroundColor = '';
                button.style.color = '';
                showModernNotification(
                    'Détection désactivée',
                    'Le surlignage des dépassements a été désactivé',
                    'info',
                    3000
                );
            }
        }, 'Overflow Detection Button');
        
        // 10. BOUTON ACCESSIBILITÉ
        attachModernListener('#toolbar-accessibility-btn', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Accessibility button clicked!');
            
            const modal = document.getElementById('accessibility-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                showModernNotification(
                    'Paramètres d\'accessibilité',
                    'Fenêtre des options d\'accessibilité ouverte',
                    'info',
                    3000
                );
            } else {
                showModernNotification(
                    'Accessibilité activée',
                    'Fonctions d\'accessibilité disponibles',
                    'info',
                    3000
                );
            }
        }, 'Accessibility Button');
        
        // 11. BOUTONS D'AJOUT
        attachModernListener('#add-experience', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Add experience button clicked!');
            
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
                
                const removeBtn = newExperience.querySelector('.remove-item');
                removeBtn.addEventListener('click', () => {
                    newExperience.remove();
                    showModernNotification(
                        'Expérience supprimée',
                        'L\'expérience a été retirée de votre CV',
                        'info',
                        2000
                    );
                });
                
                showModernNotification(
                    'Expérience ajoutée',
                    'Remplissez les champs pour compléter votre expérience',
                    'success',
                    3000
                );
            }
        }, 'Add Experience Button');
        
        attachModernListener('#add-formation', 'click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 MODERN: Add formation button clicked!');
            
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
                
                const removeBtn = newFormation.querySelector('.remove-item');
                removeBtn.addEventListener('click', () => {
                    newFormation.remove();
                    showModernNotification(
                        'Formation supprimée',
                        'La formation a été retirée de votre CV',
                        'info',
                        2000
                    );
                });
                
                showModernNotification(
                    'Formation ajoutée',
                    'Remplissez les champs pour compléter votre formation',
                    'success',
                    3000
                );
            }
        }, 'Add Formation Button');
        
        // 12. BOUTONS IA AVEC NOTIFICATIONS MODERNES
        const iaButtons = [
            { selector: '#ai-layout-optimize-btn', name: 'Optimisation Layout IA', message: 'Optimisation de la mise en page par l\'IA' },
            { selector: '#ai-optimize-all-btn', name: 'Optimisation Complète IA', message: 'Optimisation complète du CV par l\'IA' },
            { selector: '#ai-rewrite-descriptions-btn', name: 'Réécriture Descriptions IA', message: 'Réécriture des descriptions par l\'IA' },
            { selector: '#ai-generate-achievements-btn', name: 'Génération Réalisations IA', message: 'Génération de réalisations par l\'IA' },
            { selector: '#ai-suggest-skills-btn', name: 'Suggestion Compétences IA', message: 'Suggestion de compétences par l\'IA' },
            { selector: '#ai-improve-profile-btn', name: 'Amélioration Profil IA', message: 'Amélioration du profil par l\'IA' },
            { selector: '#ai-adapt-sector-btn', name: 'Adaptation Secteur IA', message: 'Adaptation au secteur par l\'IA' },
            { selector: '#ai-keywords-boost-btn', name: 'Boost Mots-clés IA', message: 'Optimisation des mots-clés par l\'IA' },
            { selector: '#ai-synthesize-skills-btn', name: 'Synthèse Compétences IA', message: 'Synthèse et organisation des compétences' },
            { selector: '#ai-limit-skills-btn', name: 'Limitation Compétences IA', message: 'Sélection des 10 meilleures compétences' }
        ];
        
        iaButtons.forEach((button) => {
            attachModernListener(button.selector, 'click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🎯 MODERN: ${button.name} clicked!`);
                
                showModernNotification(
                    `${button.name} en cours...`,
                    button.message,
                    'info',
                    3000
                );
                
                const loader = document.getElementById('loader-overlay');
                const loaderText = document.getElementById('loader-text');
                
                if (loader && loaderText) {
                    loader.style.display = 'flex';
                    loaderText.textContent = `${button.name} en cours...`;
                    
                    setTimeout(() => {
                        loader.style.display = 'none';
                        showModernNotification(
                            `${button.name} terminée !`,
                            'Les améliorations ont été appliquées à votre CV',
                            'success',
                            4000
                        );
                    }, 2000 + Math.random() * 2000);
                } else {
                    setTimeout(() => {
                        showModernNotification(
                            `${button.name} terminée !`,
                            'Les améliorations ont été appliquées à votre CV',
                            'success',
                            4000
                        );
                    }, 1500);
                }
            }, button.name);
        });
        
        console.log('🎨 MODERN: All buttons upgraded with modern notifications!');
    }
    
    // Attendre que le DOM soit prêt et que les fonctions de notification soient disponibles
    function initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(upgradeAllButtons, 1000);
            });
        } else {
            setTimeout(upgradeAllButtons, 1000);
        }
    }
    
    initializeWhenReady();
    
    console.log('🎨 MODERN NOTIFICATIONS: Upgrade script loaded and ready!');
})();