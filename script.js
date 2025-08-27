
        // This script is now self-contained and does not use Firebase for saving.
        
        document.addEventListener('DOMContentLoaded', function() {
            // --- ENSURE ALL OVERLAYS ARE HIDDEN ON PAGE LOAD ---
            function hideAllOverlays() {
                // Hide loader overlay
                const loaderOverlay = document.getElementById('loader-overlay');
                if (loaderOverlay) {
                    loaderOverlay.classList.add('hidden');
                    loaderOverlay.classList.remove('flex');
                }
                
                // Hide AI thinking overlay
                const aiThinkingOverlay = document.getElementById('ai-thinking-overlay');
                if (aiThinkingOverlay) {
                    aiThinkingOverlay.classList.remove('active');
                }
                
                // Hide confirm modal (correct id)
                const confirmModal = document.getElementById('confirm-modal');
                if (confirmModal) {
                    confirmModal.classList.remove('active');
                }

                // Ensure any modal overlays are not active
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });

                // Hide CV restructure overlay if present
                const cvRestructureOverlay = document.getElementById('cv-restructure-overlay');
                if (cvRestructureOverlay) {
                    cvRestructureOverlay.classList.remove('active');
                }
                
                // Ensure body doesn't have presentation mode class
                document.body.classList.remove('presentation-mode', 'overflow-check-active', 'is-resizing');
                
                // Enable pointer events on body
                document.body.style.pointerEvents = 'auto';
            }
            
            // Call immediately to fix any stuck overlays
            hideAllOverlays();
            
            // --- GLOBAL SELECTORS (STATIC) ---
            const controls = {
                aiInput: document.getElementById('ai-input'), analyzeBtn: document.getElementById('analyze-btn'), loader: document.getElementById('loader-overlay'), loaderText: document.getElementById('loader-text'),
                nom: document.getElementById('nom'), prenom: document.getElementById('prenom'), poste: document.getElementById('poste'),
                description: document.getElementById('description'), competences: document.getElementById('competences'), aiSynthesizeSkillsBtn: document.getElementById('ai-synthesize-skills-btn'),
                experienceList: document.getElementById('experience-list'), addExperienceBtn: document.getElementById('add-experience'),
                formationList: document.getElementById('formation-list'), addFormationBtn: document.getElementById('add-formation'),
                toggleBanner: document.getElementById('toggle-banner-checkbox'), bannerNom: document.getElementById('banner-nom'), bannerPoste: document.getElementById('banner-poste'), bannerEmail: document.getElementById('banner-email'), bannerTel: document.getElementById('banner-tel'), bannerImage: document.getElementById('banner-image'),
                bannerStyleSelect: document.getElementById('banner-style-select'), bannerInvertBtn: document.getElementById('banner-invert-btn'),
                // ContrÃ´les de style de texte banniÃ¨re
                bannerNomBold: document.getElementById('banner-nom-bold'), bannerNomItalic: document.getElementById('banner-nom-italic'),
                bannerPosteBold: document.getElementById('banner-poste-bold'), bannerPosteItalic: document.getElementById('banner-poste-italic'),
                bannerContactBold: document.getElementById('banner-contact-bold'), bannerContactItalic: document.getElementById('banner-contact-italic'),
                fixBannerTopBtn: document.getElementById('fix-banner-top-btn'), fixBannerBottomBtn: document.getElementById('fix-banner-bottom-btn'), modularBannerBtn: document.getElementById('modular-banner-btn'),
                qualificationDispo: document.getElementById('qualification-dispo'), qualificationSalaire: document.getElementById('qualification-salaire'), qualificationLoc: document.getElementById('qualification-loc'),
                generateMailBtn: document.getElementById('generate-mail-btn'), recruiterMailContent: document.getElementById('recruiter-mail-content'),
                anonymizeBtn: document.getElementById('toolbar-anonymize-btn'), 
                downloadPdfBtn: document.getElementById('toolbar-pdf-btn'),
                accessibilityBtn: document.getElementById('toolbar-accessibility-btn'),
                resetCvBtn: document.getElementById('toolbar-new-cv-btn'),
                togglePresentationModeBtn: document.getElementById('toolbar-presentation-btn'),
                toggleOverflowBtn: document.getElementById('toolbar-overflow-btn'),
                aiSummarizeBtn: document.getElementById('ai-synthesize-experiences-btn'),
                
                // Nouveaux boutons IA
                aiLayoutOptimizeBtn: document.getElementById('ai-layout-optimize-btn'),
                aiOptimizeAllBtn: document.getElementById('ai-optimize-all-btn'),
                aiRewriteDescriptionsBtn: document.getElementById('ai-rewrite-descriptions-btn'),
                aiGenerateAchievementsBtn: document.getElementById('ai-generate-achievements-btn'),
                aiSuggestSkillsBtn: document.getElementById('ai-suggest-skills-btn'),
                aiImproveProfileBtn: document.getElementById('ai-improve-profile-btn'),
                aiAdaptSectorBtn: document.getElementById('ai-adapt-sector-btn'),
                aiKeywordsBoostBtn: document.getElementById('ai-keywords-boost-btn'),
                
                // Overlay et animation IA
                aiThinkingOverlay: document.getElementById('ai-thinking-overlay'),
                aiThinkingTitle: document.getElementById('ai-thinking-title'),
                aiThinkingSubtitle: document.getElementById('ai-thinking-subtitle'),
                aiCurrentAction: document.getElementById('ai-current-action'),
                resetRecruiterBtn: document.getElementById('reset-recruiter-btn'),
                // Nouveaux boutons pour sauvegarder/charger banniÃ¨re et info recruteur
                saveBannerPresetBtn: document.getElementById('save-banner-preset-btn'),
                loadBannerPresetBtn: document.getElementById('load-banner-preset-btn'),
                saveRecruiterInfoBtn: document.getElementById('save-recruiter-info-btn'),
                loadRecruiterInfoBtn: document.getElementById('load-recruiter-info-btn'),
                aiLimitSkillsBtn: document.getElementById('ai-limit-skills-btn'),
                // Nouveaux contrÃ´les de la barre d'outils
                toolbarSaveBtn: document.getElementById('toolbar-save-btn'),
                toolbarLoadBtn: document.getElementById('toolbar-load-btn'),
                toolbarTemplateBtn: document.getElementById('toolbar-template-btn'),
                geminiApiKey: document.getElementById('gemini-api-key'),
                saveApiKeyBtn: document.getElementById('save-api-key-btn'),
                
                // Nouveaux contrÃ´les d'API
                chatgptApiKey: document.getElementById('chatgpt-api-key'),
                saveGeminiKeyBtn: document.getElementById('save-gemini-key-btn'),
                saveChatgptKeyBtn: document.getElementById('save-chatgpt-key-btn'),
                selectGeminiBtn: document.getElementById('select-gemini-btn'),
                selectChatgptBtn: document.getElementById('select-chatgpt-btn'),
                switchApiBtn: document.getElementById('switch-api-btn'),
                switchApiText: document.getElementById('switch-api-text'),
                geminiApiGroup: document.getElementById('gemini-api-group'),
                chatgptApiGroup: document.getElementById('chatgpt-api-group'),
                geminiStatus: document.getElementById('gemini-status'),
                chatgptStatus: document.getElementById('chatgpt-status'),
                currentApiInfo: document.getElementById('current-api-info'),
                // Indicateurs d'Ã©tat de l'API
                apiStatusIcon: document.getElementById('api-status-icon'),
                apiStatusText: document.getElementById('api-status-text'),
                pageMargin: document.getElementById('page-margin'), pageMarginValue: document.getElementById('page-margin-value'),
                moduleSpacing: document.getElementById('module-spacing'), moduleSpacingValue: document.getElementById('module-spacing-value'),
                itemSpacing: document.getElementById('item-spacing'), itemSpacingValue: document.getElementById('item-spacing-value'),
                fontSizeH1: document.getElementById('font-size-h1'), fontSizeH1Value: document.getElementById('font-size-h1-value'),
                fontSizeH2: document.getElementById('font-size-h2'), fontSizeH2Value: document.getElementById('font-size-h2-value'),
                fontSizeP: document.getElementById('font-size-p'), fontSizePValue: document.getElementById('font-size-p-value'),
                fontSizeBanner: document.getElementById('font-size-banner'), fontSizeBannerValue: document.getElementById('font-size-banner-value'),
                bannerElementSpacing: document.getElementById('banner-element-spacing'), bannerElementSpacingValue: document.getElementById('banner-element-spacing-value'),
                lineHeight: document.getElementById('line-height'), lineHeightValue: document.getElementById('line-height-value'),
                paragraphSpacing: document.getElementById('paragraph-spacing'), paragraphSpacingValue: document.getElementById('paragraph-spacing-value'),
                randomizeBannerStyleBtn: document.getElementById('randomize-banner-style-btn'),
                bannerNomFont: document.getElementById('banner-nom-font'), bannerNomSize: document.getElementById('banner-nom-size'), bannerNomSizeValue: document.getElementById('banner-nom-size-value'), bannerNomColor: document.getElementById('banner-nom-color'), bannerNomBold: document.getElementById('banner-nom-bold'), bannerNomItalic: document.getElementById('banner-nom-italic'),
                bannerPosteSize: document.getElementById('banner-poste-size'), bannerPosteSizeValue: document.getElementById('banner-poste-size-value'), bannerPosteColor: document.getElementById('banner-poste-color'), bannerPosteBold: document.getElementById('banner-poste-bold'), bannerPosteItalic: document.getElementById('banner-poste-italic'),
                bannerContactSize: document.getElementById('banner-contact-size'), bannerContactSizeValue: document.getElementById('banner-contact-size-value'), bannerContactColor: document.getElementById('banner-contact-color'), bannerContactBold: document.getElementById('banner-contact-bold'), bannerContactItalic: document.getElementById('banner-contact-italic'),
                undoBtn: document.getElementById('undo-btn'), redoBtn: document.getElementById('redo-btn'),
                collapseAllBtn: document.getElementById('collapse-all-btn'),
                addSectionBtn: document.getElementById('add-section-btn'), customSectionsList: document.getElementById('custom-sections-list'), sectionSuggestionSelect: document.getElementById('section-suggestion-select'), newSectionTitleInput: document.getElementById('new-section-title-input'),
                primaryColorPicker: document.getElementById('primary-color-picker'),
                secondaryColorPicker: document.getElementById('secondary-color-picker'),
                aiColorBtn: document.getElementById('ai-color-btn'),
                bodyTextColorPicker: document.getElementById('body-text-color-picker'),
                fontFamilyH1Select: document.getElementById('font-family-h1-select'),
                fontFamilyH2Select: document.getElementById('font-family-h2-select'),
                fontFamilyBodySelect: document.getElementById('font-family-body-select'),
                shareBtn: document.getElementById('toolbar-share-btn'), shareModal: document.getElementById('share-modal'), closeShareModal: document.getElementById('close-share-modal'), shareLinkInput: document.getElementById('share-link-input'), copyShareLinkBtn: document.getElementById('copy-share-link-btn'),
                iconPickerModal: document.getElementById('icon-picker-modal'), closeIconPickerModal: document.getElementById('close-icon-picker-modal'), iconPickerGrid: document.getElementById('icon-picker-grid'), iconSearchInput: document.getElementById('icon-search-input'),
                addPageBtn: document.getElementById('add-page-btn'),
                bannerBgImage: document.getElementById('banner-bg-image'),
                bannerBgOpacity: document.getElementById('banner-bg-opacity'),
                bannerBgOpacityValue: document.getElementById('banner-bg-opacity-value'),
                bannerBgBlur: document.getElementById('banner-bg-blur'),
                bannerBgBlurValue: document.getElementById('banner-bg-blur-value'),
                bannerBgGrayscale: document.getElementById('banner-bg-grayscale'),
                removeBannerBgBtn: document.getElementById('remove-banner-bg-btn'),
                skillsTextControls: document.getElementById('skills-text-controls'),
                skillsLevelControls: document.getElementById('skills-level-controls'),
                skillsLevelList: document.getElementById('skills-level-list'),
                addSkillLevelBtn: document.getElementById('add-skill-level-btn'),
                confirmModal: {
                    overlay: document.getElementById('confirm-modal'),
                    title: document.getElementById('confirm-modal-title'),
                    text: document.getElementById('confirm-modal-text'),
                    okBtn: document.getElementById('confirm-modal-ok-btn'),
                    cancelBtn: document.getElementById('confirm-modal-cancel-btn'),
                },
                // Nouveaux contrÃ´les pour le redimensionnement et le zoom
                panelToggleLeft: document.getElementById('panel-toggle-left'),
                panelToggleTop: document.getElementById('panel-toggle-top'),
                zoomControls: document.getElementById('zoom-controls'),
                zoomSlider: document.getElementById('zoom-slider'),
                zoomValue: document.getElementById('zoom-value'),
                zoomIn: document.getElementById('zoom-in'),
                zoomOut: document.getElementById('zoom-out'),
                zoomReset: document.getElementById('zoom-reset'),
                controlsPanel: document.getElementById('controls'),
                topToolbar: document.querySelector('.top-toolbar')
            };

            // --- DYNAMIC SELECTORS ---
            let preview = {};
            function reinitializePreviewSelectors() {
                preview.previewWrapper = document.getElementById('cv-preview-wrapper');
                preview.cvNomPrenom = document.getElementById('cv-nom-prenom-preview');
                preview.cvPoste = document.getElementById('cv-poste-preview');
                preview.cvDescription = document.getElementById('cv-description-preview');
                preview.cvFormation = document.getElementById('cv-formation-preview');
                preview.cvCompetences = document.getElementById('cv-competences-preview');
                preview.cvExperience = document.getElementById('cv-experience-preview');
                preview.bannerModule = document.getElementById('banner-module');
                preview.banner = document.getElementById('recruiter-banner');
                preview.bannerImg = document.getElementById('banner-img-preview');
                preview.bannerNom = document.getElementById('banner-nom-preview');
                preview.bannerPoste = document.getElementById('banner-poste-preview');
                preview.bannerContact = document.getElementById('banner-contact-preview');
                preview.bannerEmail = document.getElementById('banner-email-preview');
                preview.bannerTel = document.getElementById('banner-tel-preview');
                preview.qualificationModule = document.getElementById('qualification-module');
                preview.qualificationPreview = document.getElementById('qualification-preview');
                preview.fixedBannerTop = document.getElementById('fixed-banner-top');
                preview.fixedBannerBottom = document.getElementById('fixed-banner-bottom');
                preview.bannerBgImg = document.getElementById('banner-bg-img-preview');
            }
            
            // --- CONFIGURATION OBJECTS ---
            const sliders = {
                pageMargin: { el: controls.pageMargin, valueEl: controls.pageMarginValue, property: '--page-margin', unit: 'cm' },
                moduleSpacing: { el: controls.moduleSpacing, valueEl: controls.moduleSpacingValue, property: '--module-spacing', unit: 'rem' },
                itemSpacing: { el: controls.itemSpacing, valueEl: controls.itemSpacingValue, property: '--item-spacing', unit: 'rem' },
                fontSizeH1: { el: controls.fontSizeH1, valueEl: controls.fontSizeH1Value, property: '--font-size-h1', unit: 'pt' },
                fontSizeH2: { el: controls.fontSizeH2, valueEl: controls.fontSizeH2Value, property: '--font-size-h2', unit: 'pt' },
                fontSizeP: { el: controls.fontSizeP, valueEl: controls.fontSizePValue, property: '--font-size-p', unit: 'pt' },
                fontSizeBanner: { el: controls.fontSizeBanner, valueEl: controls.fontSizeBannerValue, property: '--font-size-banner', unit: 'pt' },
                lineHeight: { el: controls.lineHeight, valueEl: controls.lineHeightValue, property: '--line-height', unit: '' },
                paragraphSpacing: { el: controls.paragraphSpacing, valueEl: controls.paragraphSpacingValue, property: '--paragraph-spacing', unit: 'rem' },
                bannerElementSpacing: { el: controls.bannerElementSpacing, valueEl: controls.bannerElementSpacingValue, property: '--banner-element-spacing', unit: 'rem' },
            };

            const bannerStyleControls = {
                nomFont: { el: controls.bannerNomFont, event: 'change', stateKey: 'nomFont' },
                nomSize: { el: controls.bannerNomSize, event: 'input', valueEl: controls.bannerNomSizeValue, stateKey: 'nomSize' },
                nomColor: { el: controls.bannerNomColor, event: 'input', stateKey: 'nomColor' },
                nomBold: { el: controls.bannerNomBold, event: 'click', toggle: true, stateKey: 'nomBold' },
                nomItalic: { el: controls.bannerNomItalic, event: 'click', toggle: true, stateKey: 'nomItalic' },
                posteSize: { el: controls.bannerPosteSize, event: 'input', valueEl: controls.bannerPosteSizeValue, stateKey: 'posteSize' },
                posteColor: { el: controls.bannerPosteColor, event: 'input', stateKey: 'posteColor' },
                posteBold: { el: controls.bannerPosteBold, event: 'click', toggle: true, stateKey: 'posteBold' },
                posteItalic: { el: controls.bannerPosteItalic, event: 'click', toggle: true, stateKey: 'posteItalic' },
                contactSize: { el: controls.bannerContactSize, event: 'input', valueEl: controls.bannerContactSizeValue, stateKey: 'contactSize' },
                contactColor: { el: controls.bannerContactColor, event: 'input', stateKey: 'contactColor' },
                contactBold: { el: controls.bannerContactBold, event: 'click', toggle: true, stateKey: 'contactBold' },
                contactItalic: { el: controls.bannerContactItalic, event: 'click', toggle: true, stateKey: 'contactItalic' },
            };

            const themes = {
                professional: {
                    primaryColor: '#2563eb', secondaryColor: '#334155', bodyTextColor: '#334155',
                    fontH1: "'Montserrat', sans-serif", fontH2: "'Montserrat', sans-serif", fontBody: "'Lato', sans-serif"
                },
                creative: {
                    primaryColor: '#db2777', secondaryColor: '#4f46e5', bodyTextColor: '#44403c',
                    fontH1: "'Playfair Display', serif", fontH2: "'Oswald', sans-serif", fontBody: "'Nunito Sans', sans-serif"
                },
                modern: {
                    primaryColor: '#16a34a', secondaryColor: '#1f2937', bodyTextColor: '#374151',
                    fontH1: "'Oswald', sans-serif", fontH2: "'Source Sans Pro', sans-serif", fontBody: "'Source Sans Pro', sans-serif"
                }
            };
            
            // --- GLOBAL STATE VARIABLES ---
            let pageCounter = 1;
            let customSectionCounter = 0;
            const root = document.documentElement;
            let isAnonymized = false;
            let originalData = {};

            // --- SYSTÈME DE NOTIFICATIONS MODERNE ---
            let notificationCounter = 0;
            
            function showNotification(title, message = '', type = 'info', duration = 5000) {
                const container = document.getElementById('notification-container');
                if (!container) {
                    console.warn('Conteneur de notifications non trouvé');
                    return;
                }

                // Créer l'ID unique pour cette notification
                const notificationId = `notification-${++notificationCounter}`;
                
                // Icônes selon le type
                const icons = {
                    success: 'fas fa-check-circle',
                    error: 'fas fa-exclamation-circle',
                    warning: 'fas fa-exclamation-triangle',
                    info: 'fas fa-info-circle'
                };

                // Créer l'élément toast
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
                    <button class="toast-close" onclick="closeNotification('${notificationId}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="toast-progress" style="width: 100%;"></div>
                `;

                // Ajouter au conteneur
                container.appendChild(toast);

                // Animation d'entrée
                setTimeout(() => {
                    toast.classList.add('show');
                }, 100);

                // Barre de progression
                if (duration > 0) {
                    const progressBar = toast.querySelector('.toast-progress');
                    progressBar.style.transition = `width ${duration}ms linear`;
                    
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                    }, 200);

                    // Auto-fermeture
                    setTimeout(() => {
                        closeNotification(notificationId);
                    }, duration);
                }

                return notificationId;
            }

            function closeNotification(notificationId) {
                const toast = document.getElementById(notificationId);
                if (toast) {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        if (toast.parentNode) {
                            toast.parentNode.removeChild(toast);
                        }
                    }, 400);
                }
            }

            // Fonction pour fermer toutes les notifications
            function closeAllNotifications() {
                const container = document.getElementById('notification-container');
                if (container) {
                    const toasts = container.querySelectorAll('.toast');
                    toasts.forEach(toast => {
                        closeNotification(toast.id);
                    });
                }
            }

            // Rendre les fonctions globales pour les boutons
            window.closeNotification = closeNotification;
            window.closeAllNotifications = closeAllNotifications;
            let isRestoringState = false; 
            let activeIconTarget = null;
            
            // --- API CONFIGURATION ---
            let currentApiProvider = 'gemini'; // 'gemini' ou 'chatgpt'
            let apiKeys = {
                gemini: '',
                chatgpt: ''
            };
            let apiStatus = {
                gemini: false,
                chatgpt: false
            };
            
            // --- UI UTILITIES ---
            function showLoader(text = "Chargement...") {
                controls.loaderText.textContent = text;
                controls.loader.classList.remove('hidden');
                controls.loader.classList.add('flex');
                controls.loader.style.pointerEvents = 'auto';
            }

            function hideLoader() {
                controls.loader.classList.add('hidden');
                controls.loader.classList.remove('flex');
                controls.loader.style.pointerEvents = 'none';
            }

            // === GESTION DE L'ACCESSIBILITÃ‰ ===
            
            // Ã‰tat des prÃ©fÃ©rences d'accessibilitÃ©
            let accessibilitySettings = {
                contrast: 'normal',
                fontSize: 100,
                lineHeight: 1.5,
                enhancedFocus: false,
                keyboardShortcuts: true,
                reduceAnimations: false,
                screenReaderMode: false,
                extendedDescriptions: false
            };
            
            // Charger les prÃ©fÃ©rences sauvegardÃ©es
            function loadAccessibilitySettings() {
                const saved = localStorage.getItem('accessibilitySettings');
                if (saved) {
                    accessibilitySettings = { ...accessibilitySettings, ...JSON.parse(saved) };
                    applyAccessibilitySettings();
                }
            }
            
            // Appliquer les paramÃ¨tres d'accessibilitÃ©
            function applyAccessibilitySettings() {
                const body = document.body;
                
                // Contraste
                body.classList.remove('high-contrast', 'dark-mode');
                if (accessibilitySettings.contrast === 'high') {
                    body.classList.add('high-contrast');
                } else if (accessibilitySettings.contrast === 'dark') {
                    body.classList.add('dark-mode');
                }
                
                // Taille de police
                body.style.fontSize = `${accessibilitySettings.fontSize}%`;
                
                // Hauteur de ligne
                body.style.lineHeight = accessibilitySettings.lineHeight;
                
                // Focus amÃ©liorÃ©
                body.classList.toggle('enhanced-focus', accessibilitySettings.enhancedFocus);
                
                // Animations rÃ©duites
                body.classList.toggle('reduced-animations', accessibilitySettings.reduceAnimations);
                
                // Mode lecteur d'Ã©cran
                body.classList.toggle('screen-reader-optimized', accessibilitySettings.screenReaderMode);
                
                // Mise Ã  jour de l'interface
                updateAccessibilityUI();
            }
            
            // Mettre Ã  jour l'interface de la popup
            function updateAccessibilityUI() {
                // Boutons de contraste
                document.querySelectorAll('.contrast-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                document.getElementById(`contrast-${accessibilitySettings.contrast}`).classList.add('active');
                document.getElementById(`contrast-${accessibilitySettings.contrast}`).setAttribute('aria-pressed', 'true');
                
                // Sliders
                const fontSizeSlider = document.getElementById('font-size-slider');
                const lineHeightSlider = document.getElementById('line-height-slider');
                if (fontSizeSlider) {
                    fontSizeSlider.value = accessibilitySettings.fontSize;
                    document.getElementById('font-size-value').textContent = `${accessibilitySettings.fontSize}%`;
                }
                if (lineHeightSlider) {
                    lineHeightSlider.value = accessibilitySettings.lineHeight;
                    const lineHeightLabels = { 1: 'SerrÃ©', 1.5: 'Normal', 2: 'Large' };
                    document.getElementById('line-height-value').textContent = lineHeightLabels[accessibilitySettings.lineHeight] || 'PersonnalisÃ©';
                }
                
                // Checkboxes
                document.getElementById('enhanced-focus').checked = accessibilitySettings.enhancedFocus;
                document.getElementById('keyboard-shortcuts').checked = accessibilitySettings.keyboardShortcuts;
                document.getElementById('reduce-animations').checked = accessibilitySettings.reduceAnimations;
                document.getElementById('screen-reader-mode').checked = accessibilitySettings.screenReaderMode;
                document.getElementById('extended-descriptions').checked = accessibilitySettings.extendedDescriptions;
            }
            
            // Sauvegarder les prÃ©fÃ©rences
            function saveAccessibilitySettings() {
                localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
                showNotification('PrÃ©fÃ©rences d\'accessibilitÃ© sauvegardÃ©es', 'success');
            }
            
            // RÃ©initialiser les prÃ©fÃ©rences
            function resetAccessibilitySettings() {
                accessibilitySettings = {
                    contrast: 'normal',
                    fontSize: 100,
                    lineHeight: 1.5,
                    enhancedFocus: false,
                    keyboardShortcuts: true,
                    reduceAnimations: false,
                    screenReaderMode: false,
                    extendedDescriptions: false
                };
                applyAccessibilitySettings();
                localStorage.removeItem('accessibilitySettings');
                showNotification('PrÃ©fÃ©rences d\'accessibilitÃ© rÃ©initialisÃ©es', 'success');
            }
            
            // Gestionnaires d'Ã©vÃ©nements pour la popup d'accessibilitÃ©
            function setupAccessibilityModal() {
                const modal = document.getElementById('accessibility-modal');
                const openBtn = controls.accessibilityBtn;
                const closeBtns = [
                    document.getElementById('close-accessibility-modal'),
                    document.getElementById('close-accessibility-modal-bottom')
                ];
                
                // Ouvrir la modal
                openBtn?.addEventListener('click', () => {
                    modal.classList.remove('hidden');
                    updateAccessibilityUI();
                    // Focus sur le premier Ã©lÃ©ment focusable
                    const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    firstFocusable?.focus();
                });
                
                // Fermer la modal
                closeBtns.forEach(btn => {
                    btn?.addEventListener('click', () => {
                        modal.classList.add('hidden');
                        openBtn?.focus(); // Retourner le focus au bouton d'ouverture
                    });
                });
                
                // Fermer avec Ã‰chap
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        openBtn?.focus();
                    }
                });
                
                // Fermer en cliquant sur l'arriÃ¨re-plan
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.add('hidden');
                        openBtn?.focus();
                    }
                });
                
                // Boutons de contraste
                document.querySelectorAll('.contrast-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const contrast = btn.id.replace('contrast-', '');
                        accessibilitySettings.contrast = contrast;
                        applyAccessibilitySettings();
                    });
                });
                
                // Sliders
                document.getElementById('font-size-slider')?.addEventListener('input', (e) => {
                    accessibilitySettings.fontSize = parseInt(e.target.value);
                    applyAccessibilitySettings();
                });
                
                document.getElementById('line-height-slider')?.addEventListener('input', (e) => {
                    accessibilitySettings.lineHeight = parseFloat(e.target.value);
                    applyAccessibilitySettings();
                });
                
                // Checkboxes
                const checkboxes = [
                    'enhanced-focus', 'keyboard-shortcuts', 'reduce-animations', 
                    'screen-reader-mode', 'extended-descriptions'
                ];
                
                checkboxes.forEach(id => {
                    document.getElementById(id)?.addEventListener('change', (e) => {
                        const setting = id.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
                        accessibilitySettings[setting] = e.target.checked;
                        applyAccessibilitySettings();
                    });
                });
                
                // Boutons d'action
                document.getElementById('save-accessibility')?.addEventListener('click', saveAccessibilitySettings);
                document.getElementById('reset-accessibility')?.addEventListener('click', resetAccessibilitySettings);
            }
            
            // Raccourcis clavier globaux
            function setupKeyboardShortcuts() {
                document.addEventListener('keydown', (e) => {
                    if (!accessibilitySettings.keyboardShortcuts) return;
                    
                    if (e.ctrlKey || e.metaKey) {
                        switch (e.key) {
                            case 's':
                                e.preventDefault();
                                controls.toolbarSaveBtn?.click();
                                break;
                            case 'p':
                                e.preventDefault();
                                controls.downloadPdfBtn?.click();
                                break;
                        }
                    }
                });
            }

            // === GESTION DES TEMPLATES DE MISE EN PAGE ===
            
            // Fonction pour extraire la configuration de mise en page actuelle
            function extractCurrentLayoutConfig() {
                return {
                    // Layout et colonnes
                    layout: document.querySelector('.layout-btn.active')?.dataset.layout || 'layout-2-col-33-67',
                    
                    // Couleurs
                    primaryColor: document.getElementById('primary-color-picker')?.value || '#3b82f6',
                    secondaryColor: document.getElementById('secondary-color-picker')?.value || '#334155',
                    
                    // Configuration de la banniÃ¨re
                    banner: {
                        enabled: document.getElementById('toggle-banner-checkbox')?.checked || false,
                        style: document.getElementById('banner-style-select')?.value || 'style-1',
                        alignment: getBannerAlignment(),
                        isInverted: document.querySelector('.banner')?.classList.contains('banner-layout-inverted') || false,
                        textStyles: {
                            nom: {
                                bold: document.getElementById('banner-nom-bold')?.checked || false,
                                italic: document.getElementById('banner-nom-italic')?.checked || false
                            },
                            poste: {
                                bold: document.getElementById('banner-poste-bold')?.checked || false,
                                italic: document.getElementById('banner-poste-italic')?.checked || false
                            },
                            contact: {
                                bold: document.getElementById('banner-contact-bold')?.checked || false,
                                italic: document.getElementById('banner-contact-italic')?.checked || false
                            }
                        }
                    },
                    
                    // Espacement et marges
                    spacing: {
                        pageMargin: document.getElementById('page-margin')?.value || '2',
                        moduleSpacing: document.getElementById('module-spacing')?.value || '1.5',
                        itemSpacing: document.getElementById('item-spacing')?.value || '0.75'
                    },
                    
                    // Tailles de police
                    fonts: {
                        h1: document.getElementById('font-size-h1')?.value || '24',
                        h2: document.getElementById('font-size-h2')?.value || '18',
                        p: document.getElementById('font-size-p')?.value || '14'
                    },
                    
                    // MÃ©tadonnÃ©es
                    metadata: {
                        createdAt: new Date().toISOString(),
                        version: '1.0'
                    }
                };
            }
            
            function getBannerAlignment() {
                const banner = document.querySelector('.banner');
                if (!banner) return 'left';
                if (banner.classList.contains('banner-align-center')) return 'center';
                if (banner.classList.contains('banner-align-right')) return 'right';
                return 'left';
            }
            
            // Fonction pour appliquer une configuration de template
            function applyTemplateConfig(templateConfig) {
                try {
                    // Appliquer le layout
                    if (templateConfig.layout) {
                        const layoutBtn = document.querySelector(`[data-layout="${templateConfig.layout}"]`);
                        if (layoutBtn) {
                            // Retirer la classe active de tous les boutons
                            document.querySelectorAll('.layout-btn').forEach(btn => btn.classList.remove('active'));
                            layoutBtn.classList.add('active');
                            layoutBtn.click(); // DÃ©clencher le changement de layout
                        }
                    }
                    
                    // Appliquer les couleurs
                    if (templateConfig.primaryColor) {
                        const primaryPicker = document.getElementById('primary-color-picker');
                        if (primaryPicker) {
                            primaryPicker.value = templateConfig.primaryColor;
                            primaryPicker.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                    
                    if (templateConfig.secondaryColor) {
                        const secondaryPicker = document.getElementById('secondary-color-picker');
                        if (secondaryPicker) {
                            secondaryPicker.value = templateConfig.secondaryColor;
                            secondaryPicker.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }
                    
                    // Appliquer la configuration de la banniÃ¨re
                    if (templateConfig.banner) {
                        const bannerCheckbox = document.getElementById('toggle-banner-checkbox');
                        if (bannerCheckbox) {
                            bannerCheckbox.checked = templateConfig.banner.enabled;
                            bannerCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                        
                        if (templateConfig.banner.style) {
                            const bannerStyleSelect = document.getElementById('banner-style-select');
                            if (bannerStyleSelect) {
                                bannerStyleSelect.value = templateConfig.banner.style;
                                bannerStyleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        }
                        
                        // Appliquer les styles de texte de la banniÃ¨re
                        if (templateConfig.banner.textStyles) {
                            const styles = templateConfig.banner.textStyles;
                            
                            ['nom', 'poste', 'contact'].forEach(element => {
                                if (styles[element]) {
                                    const boldCheckbox = document.getElementById(`banner-${element}-bold`);
                                    const italicCheckbox = document.getElementById(`banner-${element}-italic`);
                                    
                                    if (boldCheckbox) {
                                        boldCheckbox.checked = styles[element].bold;
                                        boldCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                    
                                    if (italicCheckbox) {
                                        italicCheckbox.checked = styles[element].italic;
                                        italicCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                                    }
                                }
                            });
                        }
                    }
                    
                    // Appliquer l'espacement
                    if (templateConfig.spacing) {
                        const spacingControls = [
                            { id: 'page-margin', value: templateConfig.spacing.pageMargin },
                            { id: 'module-spacing', value: templateConfig.spacing.moduleSpacing },
                            { id: 'item-spacing', value: templateConfig.spacing.itemSpacing }
                        ];
                        
                        spacingControls.forEach(control => {
                            const element = document.getElementById(control.id);
                            if (element && control.value) {
                                element.value = control.value;
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                    
                    // Appliquer les tailles de police
                    if (templateConfig.fonts) {
                        const fontControls = [
                            { id: 'font-size-h1', value: templateConfig.fonts.h1 },
                            { id: 'font-size-h2', value: templateConfig.fonts.h2 },
                            { id: 'font-size-p', value: templateConfig.fonts.p }
                        ];
                        
                        fontControls.forEach(control => {
                            const element = document.getElementById(control.id);
                            if (element && control.value) {
                                element.value = control.value;
                                element.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        });
                    }
                    
                    return true;
                } catch (error) {
                    console.error('Erreur lors de l\'application du template:', error);
                    return false;
                }
            }
            
            // Gestion du localStorage pour les templates
            function saveTemplate(name, description, config) {
                try {
                    const templates = getStoredTemplates();
                    const templateId = Date.now().toString();
                    
                    const newTemplate = {
                        id: templateId,
                        name: name,
                        description: description || '',
                        config: config,
                        createdAt: new Date().toISOString(),
                        lastUsed: null
                    };
                    
                    templates[templateId] = newTemplate;
                    localStorage.setItem('cvLayoutTemplates', JSON.stringify(templates));
                    
                    return templateId;
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde du template:', error);
                    return null;
                }
            }
            
            function getStoredTemplates() {
                try {
                    const stored = localStorage.getItem('cvLayoutTemplates');
                    return stored ? JSON.parse(stored) : {};
                } catch (error) {
                    console.error('Erreur lors de la rÃ©cupÃ©ration des templates:', error);
                    return {};
                }
            }
            
            function deleteTemplate(templateId) {
                try {
                    const templates = getStoredTemplates();
                    delete templates[templateId];
                    localStorage.setItem('cvLayoutTemplates', JSON.stringify(templates));
                    return true;
                } catch (error) {
                    console.error('Erreur lors de la suppression du template:', error);
                    return false;
                }
            }
            
            function updateTemplateLastUsed(templateId) {
                try {
                    const templates = getStoredTemplates();
                    if (templates[templateId]) {
                        templates[templateId].lastUsed = new Date().toISOString();
                        localStorage.setItem('cvLayoutTemplates', JSON.stringify(templates));
                    }
                } catch (error) {
                    console.error('Erreur lors de la mise Ã  jour du template:', error);
                }
            }
            
            // Interface utilisateur pour les templates
            function refreshTemplatesList() {
                const templatesList = document.getElementById('templates-list');
                const noTemplatesMessage = document.getElementById('no-templates-message');
                const templates = getStoredTemplates();
                const templateIds = Object.keys(templates);
                
                templatesList.innerHTML = '';
                
                if (templateIds.length === 0) {
                    noTemplatesMessage.classList.remove('hidden');
                    return;
                }
                
                noTemplatesMessage.classList.add('hidden');
                
                // Trier les templates par date de crÃ©ation (plus rÃ©cent en premier)
                templateIds.sort((a, b) => new Date(templates[b].createdAt) - new Date(templates[a].createdAt));
                
                templateIds.forEach(templateId => {
                    const template = templates[templateId];
                    const templateCard = createTemplateCard(template);
                    templatesList.appendChild(templateCard);
                });
            }
            
            function createTemplateCard(template) {
                const card = document.createElement('div');
                card.className = 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
                
                const createdDate = new Date(template.createdAt).toLocaleDateString('fr-FR');
                const lastUsedDate = template.lastUsed ? new Date(template.lastUsed).toLocaleDateString('fr-FR') : 'Jamais utilisÃ©';
                
                card.innerHTML = `
                    <div class="flex items-start justify-between mb-3">
                        <h4 class="text-lg font-semibold text-gray-900 truncate pr-2">${escapeHtml(template.name)}</h4>
                        <div class="flex space-x-1 flex-shrink-0">
                            <button class="apply-template-btn text-blue-600 hover:text-blue-800 p-1" data-template-id="${template.id}" title="Appliquer ce template">
                                <i class="fas fa-magic"></i>
                            </button>
                            <button class="duplicate-template-btn text-green-600 hover:text-green-800 p-1" data-template-id="${template.id}" title="Dupliquer ce template">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="delete-template-btn text-red-600 hover:text-red-800 p-1" data-template-id="${template.id}" title="Supprimer ce template">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    ${template.description ? `<p class="text-sm text-gray-600 mb-3">${escapeHtml(template.description)}</p>` : ''}
                    
                    <div class="text-xs text-gray-500 space-y-1">
                        <div><strong>CrÃ©Ã©:</strong> ${createdDate}</div>
                        <div><strong>DerniÃ¨re utilisation:</strong> ${lastUsedDate}</div>
                    </div>
                    
                    <div class="mt-3 flex flex-wrap gap-1">
                        <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            ${template.config.layout || 'Layout par dÃ©faut'}
                        </span>
                        <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ${template.config.banner?.enabled ? 'Avec banniÃ¨re' : 'Sans banniÃ¨re'}
                        </span>
                    </div>
                `;
                
                return card;
            }
            
            function escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
            
            // Gestionnaires d'Ã©vÃ©nements pour la modal de templates
            function setupTemplateManager() {
                const modal = document.getElementById('template-manager-modal');
                const saveTemplateModal = document.getElementById('save-template-modal');
                const openBtn = controls.toolbarTemplateBtn;
                const closeBtns = [
                    document.getElementById('close-template-modal'),
                    document.getElementById('close-template-modal-bottom')
                ];
                
                // Ouvrir la modal
                openBtn?.addEventListener('click', () => {
                    modal.classList.remove('hidden');
                    refreshTemplatesList();
                });
                
                // Fermer la modal
                closeBtns.forEach(btn => {
                    btn?.addEventListener('click', () => {
                        modal.classList.add('hidden');
                    });
                });
                
                // Fermer avec Ã‰chap
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        if (!modal.classList.contains('hidden')) {
                            modal.classList.add('hidden');
                        }
                        if (!saveTemplateModal.classList.contains('hidden')) {
                            saveTemplateModal.classList.add('hidden');
                        }
                    }
                });
                
                // Sauvegarder template actuel
                document.getElementById('save-current-template')?.addEventListener('click', () => {
                    saveTemplateModal.classList.remove('hidden');
                    document.getElementById('template-name').focus();
                });
                
                // Modal de sauvegarde
                setupSaveTemplateModal();
                
                // Exporter templates
                document.getElementById('export-templates')?.addEventListener('click', exportTemplates);
                
                // Importer templates
                document.getElementById('import-templates')?.addEventListener('click', () => {
                    document.getElementById('template-file-input').click();
                });
                
                document.getElementById('template-file-input')?.addEventListener('change', importTemplates);
                
                // DÃ©lÃ©gation d'Ã©vÃ©nements pour les actions sur les templates
                document.getElementById('templates-list')?.addEventListener('click', handleTemplateAction);
            }
            
            function setupSaveTemplateModal() {
                const modal = document.getElementById('save-template-modal');
                const closeBtns = [
                    document.getElementById('close-save-template-modal'),
                    document.getElementById('cancel-save-template')
                ];
                
                closeBtns.forEach(btn => {
                    btn?.addEventListener('click', () => {
                        modal.classList.add('hidden');
                        clearSaveTemplateForm();
                    });
                });
                
                document.getElementById('confirm-save-template')?.addEventListener('click', () => {
                    const name = document.getElementById('template-name').value.trim();
                    const description = document.getElementById('template-description').value.trim();
                    
                    if (!name) {
                        showNotification('Veuillez entrer un nom pour le template', 'error');
                        return;
                    }
                    
                    const config = extractCurrentLayoutConfig();
                    const templateId = saveTemplate(name, description, config);
                    
                    if (templateId) {
                        showNotification(`Template "${name}" sauvegardÃ© avec succÃ¨s !`, 'success');
                        modal.classList.add('hidden');
                        clearSaveTemplateForm();
                        refreshTemplatesList();
                    } else {
                        showNotification('Erreur lors de la sauvegarde du template', 'error');
                    }
                });
            }
            
            function clearSaveTemplateForm() {
                document.getElementById('template-name').value = '';
                document.getElementById('template-description').value = '';
            }
            
            function handleTemplateAction(e) {
                const target = e.target.closest('button');
                if (!target) return;
                
                const templateId = target.dataset.templateId;
                const templates = getStoredTemplates();
                const template = templates[templateId];
                
                if (!template) return;
                
                if (target.classList.contains('apply-template-btn')) {
                    applyTemplate(template);
                } else if (target.classList.contains('duplicate-template-btn')) {
                    duplicateTemplate(template);
                } else if (target.classList.contains('delete-template-btn')) {
                    deleteTemplateWithConfirmation(templateId, template.name);
                }
            }
            
            function applyTemplate(template) {
                const success = applyTemplateConfig(template.config);
                if (success) {
                    updateTemplateLastUsed(template.id);
                    showNotification(`Template "${template.name}" appliquÃ© avec succÃ¨s !`, 'success');
                    document.getElementById('template-manager-modal').classList.add('hidden');
                } else {
                    showNotification('Erreur lors de l\'application du template', 'error');
                }
            }
            
            function duplicateTemplate(template) {
                const newName = `${template.name} (Copie)`;
                const templateId = saveTemplate(newName, template.description, template.config);
                
                if (templateId) {
                    showNotification(`Template dupliquÃ© sous le nom "${newName}"`, 'success');
                    refreshTemplatesList();
                } else {
                    showNotification('Erreur lors de la duplication du template', 'error');
                }
            }
            
            function deleteTemplateWithConfirmation(templateId, templateName) {
                if (confirm(`ÃŠtes-vous sÃ»r de vouloir supprimer le template "${templateName}" ?`)) {
                    const success = deleteTemplate(templateId);
                    if (success) {
                        showNotification(`Template "${templateName}" supprimÃ©`, 'success');
                        refreshTemplatesList();
                    } else {
                        showNotification('Erreur lors de la suppression du template', 'error');
                    }
                }
            }
            
            function exportTemplates() {
                const templates = getStoredTemplates();
                const templateIds = Object.keys(templates);
                
                if (templateIds.length === 0) {
                    showNotification('Aucun template Ã  exporter', 'error');
                    return;
                }
                
                const exportData = {
                    templates: templates,
                    exportDate: new Date().toISOString(),
                    version: '1.0'
                };
                
                const dataStr = JSON.stringify(exportData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                const link = document.createElement('a');
                link.href = URL.createObjectURL(dataBlob);
                link.download = `cv-templates-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification(`${templateIds.length} template(s) exportÃ©(s) avec succÃ¨s !`, 'success');
            }
            
            function importTemplates(event) {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importData = JSON.parse(e.target.result);
                        
                        if (!importData.templates) {
                            showNotification('Format de fichier invalide', 'error');
                            return;
                        }
                        
                        const currentTemplates = getStoredTemplates();
                        let importedCount = 0;
                        
                        Object.values(importData.templates).forEach(template => {
                            if (template.name && template.config) {
                                // CrÃ©er un nouvel ID pour Ã©viter les conflits
                                const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
                                currentTemplates[newId] = {
                                    ...template,
                                    id: newId,
                                    name: `${template.name} (ImportÃ©)`,
                                    lastUsed: null
                                };
                                importedCount++;
                            }
                        });
                        
                        if (importedCount > 0) {
                            localStorage.setItem('cvLayoutTemplates', JSON.stringify(currentTemplates));
                            showNotification(`${importedCount} template(s) importÃ©(s) avec succÃ¨s !`, 'success');
                            refreshTemplatesList();
                        } else {
                            showNotification('Aucun template valide trouvÃ© dans le fichier', 'error');
                        }
                        
                    } catch (error) {
                        showNotification('Erreur lors de l\'importation du fichier', 'error');
                        console.error('Erreur d\'importation:', error);
                    }
                };
                
                reader.readAsText(file);
                event.target.value = ''; // Reset input
            }

            function showNotification(message, type = 'success', duration = 3000) {
                const toast = document.createElement('div');
                const icon = type === 'error' ? 'fa-times-circle text-red-500' : 'fa-check-circle text-green-500';
                toast.className = 'toast';
                toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
                document.getElementById('notification').appendChild(toast);
                setTimeout(() => toast.classList.add('show'), 10);
                setTimeout(() => {
                    toast.classList.remove('show');
                    toast.addEventListener('transitionend', () => toast.remove());
                }, duration);
            }
            
            function showConfirmModal(title, text) {
                return new Promise((resolve) => {
                    controls.confirmModal.title.textContent = title;
                    controls.confirmModal.text.innerHTML = text;
                    controls.confirmModal.overlay.classList.add('active');

                    const cleanup = (result) => {
                        controls.confirmModal.overlay.classList.remove('active');
                        controls.confirmModal.okBtn.onclick = null;
                        controls.confirmModal.cancelBtn.onclick = null;
                        resolve(result);
                    };

                    controls.confirmModal.okBtn.onclick = () => cleanup(true);
                    controls.confirmModal.cancelBtn.onclick = () => cleanup(false);
                });
            }


            // --- HISTORY (UNDO/REDO) SYSTEM ---
            // History is not saved, so this is a simple implementation
            function undo() { showNotification("FonctionnalitÃ© non disponible en mode hors ligne.", "error"); }
            function redo() { showNotification("FonctionnalitÃ© non disponible en mode hors ligne.", "error"); }
            
            // --- SAVE/LOAD SYSTEM ---
            function saveCV() {
                try {
                    const cvData = {
                        // Informations principales
                        nom: controls.nom.value,
                        prenom: controls.prenom.value,
                        poste: controls.poste.value,
                        description: controls.description.value,
                        competences: controls.competences.value,
                        
                        // BanniÃ¨re
                        bannerNom: controls.bannerNom.value,
                        bannerPoste: controls.bannerPoste.value,
                        bannerEmail: controls.bannerEmail.value,
                        bannerTel: controls.bannerTel.value,
                        bannerStyle: controls.bannerStyleSelect.value,
                        toggleBanner: controls.toggleBanner.checked,
                        
                        // Qualifications
                        qualificationDispo: controls.qualificationDispo.value,
                        qualificationSalaire: controls.qualificationSalaire.value,
                        qualificationLoc: controls.qualificationLoc.value,
                        recruiterMailContent: controls.recruiterMailContent.value,
                        
                        // Couleurs et styles
                        primaryColor: controls.primaryColorPicker.value,
                        secondaryColor: controls.secondaryColorPicker.value,
                        bodyTextColor: controls.bodyTextColorPicker.value,
                        fontFamilyH1: controls.fontFamilyH1Select.value,
                        fontFamilyH2: controls.fontFamilyH2Select.value,
                        fontFamilyBody: controls.fontFamilyBodySelect.value,
                        
                        // Espacements
                        pageMargin: controls.pageMargin.value,
                        moduleSpacing: controls.moduleSpacing.value,
                        itemSpacing: controls.itemSpacing.value,
                        fontSizeH1: controls.fontSizeH1.value,
                        fontSizeH2: controls.fontSizeH2.value,
                        fontSizeP: controls.fontSizeP.value,
                        fontSizeBanner: controls.fontSizeBanner.value,
                        lineHeight: controls.lineHeight.value,
                        paragraphSpacing: controls.paragraphSpacing.value,
                        
                        // Contenu HTML du CV
                        cvHTML: preview.previewWrapper ? preview.previewWrapper.innerHTML : '',
                        
                        // Timestamp
                        savedAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('cv-data', JSON.stringify(cvData));
                    return true;
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    return false;
                }
            }
            
            function loadCV() {
                try {
                    const savedData = localStorage.getItem('cv-data');
                    if (!savedData) return false;
                    
                    const cvData = JSON.parse(savedData);
                    
                    // Restaurer les champs
                    if (controls.nom) controls.nom.value = cvData.nom || '';
                    if (controls.prenom) controls.prenom.value = cvData.prenom || '';
                    if (controls.poste) controls.poste.value = cvData.poste || '';
                    if (controls.description) controls.description.value = cvData.description || '';
                    if (controls.competences) controls.competences.value = cvData.competences || '';
                    
                    if (controls.bannerNom) controls.bannerNom.value = cvData.bannerNom || '';
                    if (controls.bannerPoste) controls.bannerPoste.value = cvData.bannerPoste || '';
                    if (controls.bannerEmail) controls.bannerEmail.value = cvData.bannerEmail || '';
                    if (controls.bannerTel) controls.bannerTel.value = cvData.bannerTel || '';
                    if (controls.bannerStyleSelect) controls.bannerStyleSelect.value = cvData.bannerStyle || 'banner-style-modern';
                    if (controls.toggleBanner) controls.toggleBanner.checked = cvData.toggleBanner || false;
                    
                    if (controls.qualificationDispo) controls.qualificationDispo.value = cvData.qualificationDispo || '';
                    if (controls.qualificationSalaire) controls.qualificationSalaire.value = cvData.qualificationSalaire || '';
                    if (controls.qualificationLoc) controls.qualificationLoc.value = cvData.qualificationLoc || '';
                    if (controls.recruiterMailContent) controls.recruiterMailContent.value = cvData.recruiterMailContent || '';
                    
                    if (controls.primaryColorPicker) controls.primaryColorPicker.value = cvData.primaryColor || '#2563eb';
                    if (controls.secondaryColorPicker) controls.secondaryColorPicker.value = cvData.secondaryColor || '#334155';
                    if (controls.bodyTextColorPicker) controls.bodyTextColorPicker.value = cvData.bodyTextColor || '#334155';
                    
                    // Appliquer les changements
                    updatePreview('form');
                    
                    return true;
                } catch (error) {
                    console.error('Erreur lors du chargement:', error);
                    return false;
                }
            }
            
            // --- DRAG & DROP & RESIZE ---
            let activeResizer = null;
            let activeContainer = null;
            let activeCol1 = null;
            let initialX = 0;
            let initialCol1Width = 0;

            function initResize(e) {
                e.preventDefault();
                activeResizer = e.target;
                activeContainer = activeResizer.parentElement;
                const columns = activeContainer.querySelectorAll('.cv-column');
                activeCol1 = columns[0];
                initialX = e.clientX;
                initialCol1Width = activeCol1.offsetWidth;

                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
                document.body.classList.add('is-resizing');
            }

            function doResize(e) {
                if (!activeResizer) return;
                const dx = e.clientX - initialX;
                const newCol1Width = initialCol1Width + dx;
                const containerWidth = activeContainer.offsetWidth;
                
                if (newCol1Width < 50 || newCol1Width > containerWidth - 50) return;

                const newCol1Percent = (newCol1Width / containerWidth) * 100;
                const newCol2Percent = 100 - newCol1Percent;

                activeContainer.classList.remove('layout-2-col-33-67', 'layout-2-col-50-50', 'layout-2-col-67-33');
                activeContainer.style.gridTemplateColumns = `${newCol1Percent}% ${newCol2Percent}%`;
                activeResizer.style.left = `${newCol1Percent}%`;
            }

            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
                document.body.classList.remove('is-resizing');
                activeResizer = null;
                activeContainer = null;
                activeCol1 = null;
            }

            function setupAllResizers() {
                document.querySelectorAll('.a4-page').forEach(page => {
                    const container = page.querySelector('.cv-body-container');
                    const oldResizer = container.querySelector('.column-resizer');
                    if (oldResizer) oldResizer.remove();

                    const columns = container.querySelectorAll('.cv-column');
                    if (columns.length === 2 && getComputedStyle(container).gridTemplateColumns.split(' ').length === 2) {
                        const resizer = document.createElement('div');
                        resizer.className = 'column-resizer';
                        container.appendChild(resizer);
                        const col1 = columns[0];
                        const col1WidthPercent = parseFloat(getComputedStyle(col1).width) / parseFloat(getComputedStyle(container).width) * 100;
                        resizer.style.left = col1WidthPercent + '%';
                        resizer.addEventListener('mousedown', initResize);
                    }
                });
            }

            function initializeSortableForPage(pageId) {
                const col1 = document.getElementById(`cv-col-${pageId}-1`);
                const col2 = document.getElementById(`cv-col-${pageId}-2`);
                const onEnd = () => { checkAllPagesOverflow(); };
                if (col1) new Sortable(col1, { group: 'cv-modules', animation: 150, handle: '.drag-handle', ghostClass: 'sortable-ghost', onEnd });
                if (col2) new Sortable(col2, { group: 'cv-modules', animation: 150, handle: '.drag-handle', ghostClass: 'sortable-ghost', onEnd });
            }

            function initializeSkillSorting() {
                const skillLists = document.querySelectorAll('#cv-competences-preview ul');
                skillLists.forEach(list => {
                    new Sortable(list, {
                        group: 'skills', animation: 150, ghostClass: 'skills-ghost',
                        onEnd: function () {
                            syncFormFromPreview(document.getElementById('cv-competences-preview'));
                        }
                    });
                });
            }

            // --- PAGE & OVERFLOW MANAGEMENT ---
            function checkPageOverflow(page) {
                requestAnimationFrame(() => {
                    // Using a 1px tolerance for floating point inaccuracies
                    const isOverflowing = page.scrollHeight > page.clientHeight + 1;
                    page.classList.toggle('is-overflowing', isOverflowing);
                });
            }

            function checkAllPagesOverflow() {
                document.querySelectorAll('.a4-page').forEach(function(pageElement) {
                    checkPageOverflow(pageElement);
                });
            }

            function setupOverflowObserver(pageElement) {
                const observer = new ResizeObserver(() => {
                    checkPageOverflow(pageElement);
                });
                // Observe the page element itself and its direct content container
                observer.observe(pageElement);
                const bodyContainer = pageElement.querySelector('.cv-body-container');
                if (bodyContainer) {
                    observer.observe(bodyContainer);
                }
            }
            
            function addNewPage() {
                pageCounter++;
                const newPageContainer = document.createElement('div');
                newPageContainer.className = 'a4-page-container';
                const layoutClass = document.querySelector('.layout-btn.active')?.dataset.layout || 'layout-1-col';
                
                newPageContainer.innerHTML = `
                    <div id="page-${pageCounter}" class="a4-page">
                        <div class="cv-body-container ${layoutClass}">
                            <div id="cv-col-${pageCounter}-1" class="cv-column"></div>
                            <div id="cv-col-${pageCounter}-2" class="cv-column"></div>
                        </div>
                    </div>
                    <button class="remove-page-btn no-print"><i class="fas fa-trash-can"></i></button>
                `;
                
                const addBtnWrapper = document.getElementById('add-page-btn-wrapper');
                preview.previewWrapper.insertBefore(newPageContainer, addBtnWrapper);
                
                const newPageElement = document.getElementById(`page-${pageCounter}`);
                setupOverflowObserver(newPageElement);

                initializeSortableForPage(pageCounter);
                setupAllResizers();
                checkAllPagesOverflow();
            }


            // --- DYNAMIC CONTENT ---
            function createDynamicItem(container, fields, data = {}, index = -1) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'p-2 border rounded-md bg-white relative';
                
                fields.forEach(field => {
                    const isTextarea = field.type === 'textarea';
                    const input = document.createElement(isTextarea ? 'textarea' : 'input');
                    
                    if (!isTextarea) input.type = 'text';
                    
                    input.placeholder = field.placeholder;
                    input.className = `cv-input w-full p-1 border rounded-sm mb-1 data-${field.key}`;
                    if(isTextarea) input.rows = 3;
                    input.value = data[field.key] || '';
                    itemDiv.appendChild(input);
                });

                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '<i class="fas fa-times-circle text-red-400 hover:text-red-600"></i>';
                removeBtn.className = 'absolute top-1 right-1 remove-dynamic-item-btn';
                itemDiv.appendChild(removeBtn);
                
                if (index !== -1 && index < container.children.length) {
                    container.insertBefore(itemDiv, container.children[index]);
                } else {
                    container.appendChild(itemDiv);
                }
                
                updatePreview('form');
                const firstInput = itemDiv.querySelector('input, textarea');
                if (firstInput) firstInput.focus();
            }

            function getDynamicData(container) {
                return Array.from(container.children).map(itemDiv => ({
                    title: itemDiv.querySelector('.data-title')?.value || '',
                    meta: itemDiv.querySelector('.data-meta')?.value || '',
                    desc: itemDiv.querySelector('.data-desc')?.value || '',
                }));
            }
            
            // --- SKILLS RENDERING ---
            function renderSkillsAsTags(text) {
                let html = '';
                const sections = text.split('\n').filter(Boolean);
                sections.forEach(section => {
                    const parts = section.split(':');
                    if (parts.length === 2 && parts[0].trim() !== '') {
                        html += `<h3 class="skill-category" contenteditable="true">${parts[0].trim()}</h3>`;
                        html += `<ul>${parts[1].split(',').map(item => item.trim().replace(/\s*\(.*\)/, '')).filter(Boolean).map(item => '<li class="skill-item" contenteditable="false">' + item + '<span class="delete-skill-btn">&times;</span></li>').join('')}</ul>`;
                    } else {
                        html += `<ul>${section.split(',').map(item => item.trim().replace(/\s*\(.*\)/, '')).filter(Boolean).map(item => '<li class="skill-item" contenteditable="false">' + item + '<span class="delete-skill-btn">&times;</span></li>').join('')}</ul>`;
                    }
                });
                return html;
            }

            function renderSkillsAsLevels() {
                let html = '';
                const gaugeStyle = document.querySelector('.gauge-style-btn.active')?.dataset.gaugeStyle || 'bar';
                const skillItems = controls.skillsLevelList.querySelectorAll('.skill-level-item');

                skillItems.forEach(item => {
                    const name = item.querySelector('.skill-name-input').value;
                    const level = item.querySelector('.skill-level-input').value;
                    if (!name) return;

                    html += `<div class="skill-level">
                                        <div class="skill-level-label" contenteditable="true">${name}</div>
                                        <div class="gauge-container">${renderGauge(level, gaugeStyle)}</div>
                                    </div>`;
                });
                return html;
            }
            
            function renderGauge(level, style) {
                const max = 5;
                let gaugeHtml = '';
                switch (style) {
                    case 'dots':
                        gaugeHtml = `<div class="gauge-dots">`;
                        for (let i = 1; i <= max; i++) gaugeHtml += `<span class="${i <= level ? 'filled' : ''}">â—</span>`;
                        gaugeHtml += `</div>`;
                        break;
                    case 'stars':
                        gaugeHtml = `<div class="gauge-stars">`;
                        for (let i = 1; i <= max; i++) gaugeHtml += `<i class="${i <= level ? 'fas' : 'far'} fa-star ${i <= level ? 'filled' : ''}"></i>`;
                        gaugeHtml += `</div>`;
                        break;
                    case 'squares':
                         gaugeHtml = `<div class="gauge-squares">`;
                        for (let i = 1; i <= max; i++) gaugeHtml += `<span class="${i <= level ? 'filled' : ''}">â– </span>`;
                        gaugeHtml += `</div>`;
                        break;
                    case 'number':
                        gaugeHtml = `<div class="gauge-number">${level}/${max}</div>`;
                        break;
                    case 'bar':
                    default:
                        const width = (level / max) * 100;
                        gaugeHtml = `<div class="gauge-bar-bg"><div class="gauge-bar-fill" style="width: ${width}%;"></div></div>`;
                        break;
                }
                return gaugeHtml;
            }

            function renderSkillsAsSimple(text) {
                let html = '<ul>';
                const skills = text.split(/,|\n/).map(s => s.trim().replace(/\s*\(.*\)/, '')).filter(Boolean);
                skills.forEach(skill => {
                    html += `<li>${skill}</li>`;
                });
                html += '</ul>';
                return html;
            }

            function createSkillLevelItem(name = '', level = 3) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'skill-level-item flex items-center gap-2';
                itemDiv.innerHTML = `
                    <input type="text" placeholder="CompÃ©tence" value="${name}" class="skill-name-input cv-input flex-grow p-1 border rounded-sm">
                    <input type="range" value="${level}" min="1" max="5" class="skill-level-input w-24">
                    <span class="skill-level-value text-sm font-mono">${level}/5</span>
                    <button class="remove-skill-level-btn text-red-400 hover:text-red-600"><i class="fas fa-times-circle"></i></button>
                `;
                controls.skillsLevelList.appendChild(itemDiv);
                updatePreview('form');
            }

            // --- UPDATES & FORMATTING ---
            function updateBannerBackground() {
                const opacity = controls.bannerBgOpacity.value;
                const blur = controls.bannerBgBlur.value;
                const grayscale = controls.bannerBgGrayscale.checked;

                controls.bannerBgOpacityValue.textContent = opacity;
                controls.bannerBgBlurValue.textContent = blur;

                preview.bannerBgImg.style.opacity = opacity;
                preview.bannerBgImg.style.filter = `blur(${blur}px) grayscale(${grayscale ? 1 : 0})`;
            }

            function updatePreview(source = 'form') {
                if (source === 'form' || source === 'banner-style' || source === 'theme' || source === 'state') {
                    preview.cvNomPrenom.textContent = `${controls.prenom.value} ${controls.nom.value}`.trim() || 'PrÃ©nom NOM';
                    preview.cvPoste.textContent = controls.poste.value || 'Poste RecherchÃ©';
                    preview.cvDescription.innerHTML = `<div class="editable-wrapper"><p contenteditable="true">${controls.description.value.replace(/\n/g, '<br>') || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                    
                    const renderDynamicList = (previewContainer, controlContainer, type) => {
                        previewContainer.innerHTML = '';
                        const data = getDynamicData(controlContainer);

                        const createInsertButton = (type, index) => {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'insert-line-wrapper';
                            wrapper.innerHTML = `<button class="add-line-preview-btn" data-type="${type}" data-index="${index}" title="InsÃ©rer un nouveau bloc ici"><i class="fas fa-plus"></i></button>`;
                            return wrapper;
                        };

                        const createItemContainer = (item, i) => {
                            const itemContainer = document.createElement('div');
                            itemContainer.className = 'dynamic-item-container';
                            itemContainer.dataset.index = i;
                            itemContainer.dataset.type = type;

                            const itemContent = document.createElement('div');
                            itemContent.className = "dynamic-preview-item";
                            itemContent.innerHTML = `<button class="delete-block-btn" title="Supprimer le bloc"><i class="fas fa-trash-alt"></i></button>`;

                            if (type === 'experience') {
                                const titleHTML = `<div class="editable-wrapper"><p class="item-title" contenteditable="true">${item.title || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                                const metaHTML = `<div class="editable-wrapper"><p class="item-meta" contenteditable="true">${item.meta || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                                const descHTML = `<div class="editable-wrapper"><p class="mt-1" contenteditable="true">${item.desc.replace(/\n/g, '<br>') || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                                const addButtonHTML = `<button class="add-desc-line-btn"><i class="fas fa-plus mr-1"></i> Ajouter une mission</button>`;
                                itemContent.innerHTML += `${titleHTML}${metaHTML}${descHTML}${addButtonHTML}`;
                            } else { // formation
                                const titleHTML = `<div class="editable-wrapper"><p class="item-title" contenteditable="true">${item.title || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                                const metaHTML = `<div class="editable-wrapper"><p class="item-meta" contenteditable="true">${item.meta || '&nbsp;'}</p><span class="delete-line-btn"><i class="fas fa-times"></i></span></div>`;
                                itemContent.innerHTML += `${titleHTML}${metaHTML}`;
                            }
                            
                            itemContainer.appendChild(createInsertButton(type, i));
                            itemContainer.appendChild(itemContent);
                            return itemContainer;
                        };
                        
                        data.forEach((item, i) => {
                            previewContainer.appendChild(createItemContainer(item, i));
                        });
                        const finalButtonWrapper = document.createElement('div');
                        finalButtonWrapper.className = 'dynamic-item-container';
                        finalButtonWrapper.appendChild(createInsertButton(type, data.length));
                        previewContainer.appendChild(finalButtonWrapper);
                    };

                    renderDynamicList(preview.cvExperience, controls.experienceList, 'experience');
                    renderDynamicList(preview.cvFormation, controls.formationList, 'formation');

                    const skillStyle = document.querySelector('.skill-style-btn.active')?.dataset.skillStyle || 'tags';
                    preview.cvCompetences.dataset.style = skillStyle;
                    
                    if (skillStyle === 'tags') {
                        preview.cvCompetences.innerHTML = renderSkillsAsTags(controls.competences.value);
                        initializeSkillSorting(); 
                    } else if (skillStyle === 'levels') {
                        preview.cvCompetences.innerHTML = renderSkillsAsLevels();
                    } else { // simple
                        preview.cvCompetences.innerHTML = renderSkillsAsSimple(controls.competences.value);
                    }

                    document.querySelectorAll('.custom-module-preview').forEach(m => m.remove());
                    Array.from(controls.customSectionsList.children).forEach(div => {
                        const sectionId = div.dataset.sectionId;
                        const title = div.querySelector('input').value;
                        const content = div.querySelector('textarea').value;
                        const iconClass = div.dataset.icon || 'fas fa-puzzle-piece';
                        
                        const moduleDiv = document.createElement('div');
                        moduleDiv.id = sectionId;
                        moduleDiv.className = 'cv-module custom-module-preview'; 
                        moduleDiv.innerHTML = `
                            <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                            <h2 class="section-title" data-section-id="${sectionId}"><i class="${iconClass} section-icon"></i><span contenteditable="true">${title}</span><div class="section-ai-actions"><button class="ai-action-btn toggle-visibility-btn" title="Masquer/Afficher la section"><i class="fas fa-eye"></i></button></div></h2>
                            <div class="dynamic-preview-item">
                                <button class="delete-block-btn" title="Supprimer la section"><i class="fas fa-trash-alt"></i></button>
                                <div class="editable-wrapper">
                                    <div class="custom-content" contenteditable="true">${content.replace(/\n/g, '<br>') || '&nbsp;'}</div>
                                    <span class="delete-line-btn"><i class="fas fa-times"></i></span>
                                </div>
                            </div>
                        `;
                        const lastModule = document.querySelector('#competences-module');
                        if(lastModule && lastModule.parentElement) {
                            lastModule.parentElement.insertBefore(moduleDiv, lastModule.nextSibling);
                        }
                    });
                    
                    preview.bannerNom.textContent = controls.bannerNom.value || "Nom PrÃ©nom Recruteur";
                    preview.bannerPoste.textContent = controls.bannerPoste.value || "Poste du Recruteur";
                    preview.bannerEmail.textContent = controls.bannerEmail.value || "email@recruteur.com";
                    preview.bannerTel.textContent = controls.bannerTel.value || "01 23 45 67 89";
                }

                preview.bannerNom.style.fontFamily = controls.bannerNomFont.value;
                preview.bannerNom.style.fontSize = controls.bannerNomSize.value + 'pt';
                preview.bannerNom.style.color = controls.bannerNomColor.value;
                preview.bannerNom.style.fontWeight = controls.bannerNomBold.classList.contains('active') ? 'bold' : 'normal';
                preview.bannerNom.style.fontStyle = controls.bannerNomItalic.classList.contains('active') ? 'italic' : 'normal';
                
                preview.bannerPoste.style.fontSize = controls.bannerPosteSize.value + 'pt';
                preview.bannerPoste.style.color = controls.bannerPosteColor.value;
                preview.bannerPoste.style.fontWeight = controls.bannerPosteBold.classList.contains('active') ? 'bold' : 'normal';
                preview.bannerPoste.style.fontStyle = controls.bannerPosteItalic.classList.contains('active') ? 'italic' : 'normal';

                preview.bannerContact.style.fontSize = controls.bannerContactSize.value + 'pt';
                preview.bannerContact.style.color = controls.bannerContactColor.value;
                preview.bannerContact.style.fontWeight = controls.bannerContactBold.classList.contains('active') ? 'bold' : 'normal';
                preview.bannerContact.style.fontStyle = controls.bannerContactItalic.classList.contains('active') ? 'italic' : 'normal';
                
                const dispo = controls.qualificationDispo.value;
                const salaire = controls.qualificationSalaire.value;
                const loc = controls.qualificationLoc.value;
                let qualHTML = '';
                if (dispo) qualHTML += `<div><i class="fas fa-calendar-check mr-1 text-gray-400"></i> ${dispo}</div>`;
                if (salaire) qualHTML += `<div><i class="fas fa-euro-sign mr-1 text-gray-400"></i> ${salaire}</div>`;
                if (loc) qualHTML += `<div><i class="fas fa-map-marker-alt mr-1 text-gray-400"></i> ${loc}</div>`;
                preview.qualificationPreview.innerHTML = qualHTML;
                preview.qualificationModule.style.display = (dispo || salaire || loc) ? '' : 'none';

                const isBannerEnabled = controls.toggleBanner.checked;
                const isBannerInTop = preview.fixedBannerTop.contains(preview.banner);
                const isBannerInBottom = preview.fixedBannerBottom.contains(preview.banner);
                const isBannerInModule = preview.bannerModule.contains(preview.banner);
                
                preview.bannerModule.classList.toggle('hidden', !isBannerEnabled || !isBannerInModule);
                preview.fixedBannerTop.style.display = (isBannerEnabled && isBannerInTop) ? 'block' : 'none';
                preview.fixedBannerBottom.style.display = (isBannerEnabled && isBannerInBottom) ? 'block' : 'none';

                checkAllPagesOverflow();
            }
            
            function syncFormFromPreview(element) {
                if (!element) return;
                const id = element.id;

                if (id === 'cv-competences-preview') {
                    const style = preview.cvCompetences.dataset.style;
                    if (style === 'levels') {
                        const skillLabels = preview.cvCompetences.querySelectorAll('.skill-level-label');
                        const controlInputs = controls.skillsLevelList.querySelectorAll('.skill-name-input');
                        skillLabels.forEach((label, index) => {
                            if (controlInputs[index]) {
                                controlInputs[index].value = label.textContent;
                            }
                        });
                    } else { 
                        let result = [];
                        const nodes = Array.from(element.childNodes);
                        for (let i = 0; i < nodes.length; i++) {
                            const node = nodes[i];
                            if (node.nodeName === 'H3' && node.classList.contains('skill-category')) {
                                const categoryName = node.textContent.trim();
                                const nextNode = nodes[i + 1];
                                if (nextNode && nextNode.nodeName === 'UL') {
                                    const skills = Array.from(nextNode.querySelectorAll('li.skill-item')).map(li => li.textContent.replace('Ã—', '').trim()).filter(Boolean).join(', ');
                                    if (categoryName && skills) {
                                        result.push(`${categoryName}: ${skills}`);
                                    }
                                    i++; 
                                }
                            } else if (node.nodeName === 'UL') {
                                const skills = Array.from(node.querySelectorAll('li')).map(li => li.textContent.replace('Ã—', '').trim()).filter(Boolean).join(', ');
                                if (skills) {
                                    result.push(skills);
                                }
                            }
                        }
                        controls.competences.value = result.join('\n');
                    }
                    return;
                }
                
                let text = element.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
                text = new DOMParser().parseFromString(text, "text/html").documentElement.textContent;

                if (id) {
                    switch (id) {
                        case 'cv-nom-prenom-preview': const nameParts = text.trim().split(' '); controls.prenom.value = nameParts.shift() || ''; controls.nom.value = nameParts.join(' ') || ''; break;
                        case 'cv-poste-preview': controls.poste.value = text; break;
                        case 'cv-description-preview': controls.description.value = text; break;
                        case 'banner-nom-preview': controls.bannerNom.value = text; break;
                        case 'banner-poste-preview': controls.bannerPoste.value = text; break;
                        case 'banner-email-preview': controls.bannerEmail.value = text; break;
                        case 'banner-tel-preview': controls.bannerTel.value = text; break;
                    }
                } else {
                    const itemContainer = element.closest('.dynamic-item-container');
                    if (itemContainer) {
                        const index = parseInt(itemContainer.dataset.index, 10);
                        const type = itemContainer.dataset.type;
                        const formList = type === 'experience' ? controls.experienceList : controls.formationList;
                        const formItem = formList.children[index];
                        if (!formItem) return;

                        const title = itemContainer.querySelector('.item-title')?.textContent || '';
                        const meta = itemContainer.querySelector('.item-meta')?.textContent || '';
                        const descEl = itemContainer.querySelector('.mt-1');
                        const desc = descEl ? new DOMParser().parseFromString(descEl.innerHTML.replace(/<br\s*\/?>/gi, '\n'), "text/html").documentElement.textContent : '';

                        if (formItem.querySelector('.data-title')) formItem.querySelector('.data-title').value = title;
                        if (formItem.querySelector('.data-meta')) formItem.querySelector('.data-meta').value = meta;
                        if (formItem.querySelector('.data-desc')) formItem.querySelector('.data-desc').value = desc;

                    } else {
                        const customModule = element.closest('.custom-module-preview');
                        if (customModule) {
                            const sectionId = customModule.id;
                            const controlTitleInput = document.getElementById(`custom-section-title-${sectionId}`);
                            const controlContentTextarea = document.getElementById(`custom-section-content-${sectionId}`);
                            
                            if (element.matches('[contenteditable].section-title span')) {
                               if (controlTitleInput) controlTitleInput.value = element.textContent;
                            }
                            if (element.matches('[contenteditable].custom-content')) {
                               if (controlContentTextarea) controlContentTextarea.value = text;
                            }
                        }
                    }
                }
            }

            function moveBannerTo(destination) {
                const recruiterBanner = preview.banner;
                if (destination === 'top') {
                    preview.fixedBannerTop.appendChild(recruiterBanner);
                } else if (destination === 'bottom') {
                    preview.fixedBannerBottom.appendChild(recruiterBanner);
                } else { // 'modular'
                    preview.bannerModule.querySelector('.drag-handle').insertAdjacentElement('afterend', recruiterBanner);
                }
                const isModular = (destination === 'modular');
                document.getElementById('banner-fix-controls').classList.toggle('hidden', !isModular);
                controls.modularBannerBtn.classList.toggle('hidden', isModular);
                updatePreview('banner-move');
            }

            function addCustomSection(title = 'Nouvelle Section', content = '', id = null, icon = 'fas fa-puzzle-piece') {
                customSectionCounter++;
                const sectionId = id || `custom-module-${Date.now()}-${customSectionCounter}`;
                
                const controlDiv = document.createElement('div');
                controlDiv.className = 'p-2 border rounded-md bg-white relative';
                controlDiv.dataset.sectionId = sectionId;
                controlDiv.dataset.icon = icon;
                controlDiv.innerHTML = `
                    <input type="text" value="${title}" class="w-full p-1 border rounded-sm mb-1 font-semibold custom-section-input" id="custom-section-title-${sectionId}">
                    <textarea rows="4" class="w-full p-1 border rounded-sm mb-1 custom-section-input" id="custom-section-content-${sectionId}" placeholder="Contenu...">${content}</textarea>
                    <button class="absolute top-1 right-1 text-red-400 hover:text-red-600 remove-section-btn"><i class="fas fa-times-circle"></i></button>
                `;
                controls.customSectionsList.appendChild(controlDiv);
                
                updatePreview('form');
                updateAllStyles();
            }

            // --- HELPER FUNCTIONS ---
            
            // --- FONCTIONS DE GESTION DES API MULTIPLES ---
            function initializeApiSettings() {
                // Charger les clÃ©s API sauvegardÃ©es
                apiKeys.gemini = localStorage.getItem('gemini-api-key') || '';
                apiKeys.chatgpt = localStorage.getItem('chatgpt-api-key') || '';
                currentApiProvider = localStorage.getItem('current-api-provider') || 'gemini';
                
                // Mettre Ã  jour les champs
                if (controls.geminiApiKey) controls.geminiApiKey.value = apiKeys.gemini;
                if (controls.chatgptApiKey) controls.chatgptApiKey.value = apiKeys.chatgpt;
                
                // Mettre Ã  jour l'interface
                updateApiInterface();
                updateApiStatus();
            }
            
            function updateApiInterface() {
                const isGemini = currentApiProvider === 'gemini';
                
                // Mise Ã  jour des boutons de sÃ©lection
                if (controls.selectGeminiBtn) {
                    controls.selectGeminiBtn.classList.toggle('active', isGemini);
                }
                if (controls.selectChatgptBtn) {
                    controls.selectChatgptBtn.classList.toggle('active', !isGemini);
                }
                
                // Affichage des groupes d'API
                if (controls.geminiApiGroup) {
                    controls.geminiApiGroup.style.display = isGemini ? 'flex' : 'none';
                }
                if (controls.chatgptApiGroup) {
                    controls.chatgptApiGroup.style.display = !isGemini ? 'flex' : 'none';
                }
                
                // Mise Ã  jour du bouton de basculement
                if (controls.switchApiText) {
                    controls.switchApiText.textContent = isGemini ? 'Utiliser ChatGPT' : 'Utiliser Gemini';
                }
                
                // Mise Ã  jour des informations de tooltip
                if (controls.currentApiInfo) {
                    controls.currentApiInfo.innerHTML = isGemini 
                        ? 'Gemini: Entrez votre clÃ© API Google Gemini (AIza...)<br>Obtenir une clÃ©: https://aistudio.google.com/app/apikey'
                        : 'ChatGPT: Entrez votre clÃ© API OpenAI (sk-...)<br>Obtenir une clÃ©: https://platform.openai.com/api-keys';
                }
            }
            
            function updateApiStatus() {
                // VÃ©rifier le statut des API
                const geminiKey = apiKeys.gemini;
                const chatgptKey = apiKeys.chatgpt;
                
                apiStatus.gemini = geminiKey && geminiKey.startsWith('AIza') && geminiKey.length > 30;
                apiStatus.chatgpt = chatgptKey && chatgptKey.startsWith('sk-') && chatgptKey.length > 40;
                
                // Mettre Ã  jour les indicateurs visuels
                if (controls.geminiStatus) {
                    controls.geminiStatus.classList.toggle('connected', apiStatus.gemini);
                }
                if (controls.chatgptStatus) {
                    controls.chatgptStatus.classList.toggle('connected', apiStatus.chatgpt);
                }
            }
            
            function switchApiProvider(newProvider = null) {
                if (newProvider) {
                    currentApiProvider = newProvider;
                } else {
                    currentApiProvider = currentApiProvider === 'gemini' ? 'chatgpt' : 'gemini';
                }
                
                // Sauvegarder le choix
                localStorage.setItem('current-api-provider', currentApiProvider);
                
                // Mettre Ã  jour l'interface
                updateApiInterface();
                
                // Afficher une notification
                const providerName = currentApiProvider === 'gemini' ? 'Gemini' : 'ChatGPT';
                showNotification(`ðŸ”„ BasculÃ© vers l'API ${providerName}`, 'info', 3000);
            }
            
            function saveApiKey(provider) {
                const key = provider === 'gemini' 
                    ? controls.geminiApiKey.value.trim()
                    : controls.chatgptApiKey.value.trim();
                
                if (!key) {
                    showNotification(`âŒ Veuillez entrer une clÃ© API ${provider === 'gemini' ? 'Gemini' : 'ChatGPT'}`, 'error');
                    return;
                }
                
                // Validation basique
                const isValid = provider === 'gemini' 
                    ? key.startsWith('AIza') && key.length > 30
                    : key.startsWith('sk-') && key.length > 40;
                
                if (!isValid) {
                    const format = provider === 'gemini' ? 'AIza...' : 'sk-...';
                    showNotification(`âŒ Format de clÃ© ${provider === 'gemini' ? 'Gemini' : 'ChatGPT'} invalide (doit commencer par ${format})`, 'error');
                    return;
                }
                
                // Sauvegarder
                apiKeys[provider] = key;
                localStorage.setItem(`${provider}-api-key`, key);
                
                // Mettre Ã  jour le statut
                updateApiStatus();
                
                // Notification de succÃ¨s
                const providerName = provider === 'gemini' ? 'Gemini' : 'ChatGPT';
                showNotification(`âœ… ClÃ© API ${providerName} sauvegardÃ©e !`, 'success');
            }
            
            function getCurrentApiKey() {
                return apiKeys[currentApiProvider] || localStorage.getItem(`${currentApiProvider}-api-key`) || '';
            }
            
            function validateApiKey() {
                const apiKey = getCurrentApiKey();
                
                if (!apiKey) {
                    const providerName = currentApiProvider === 'gemini' ? 'Gemini' : 'ChatGPT';
                    showNotification(`âŒ ClÃ© API ${providerName} manquante ! Configurez votre clÃ© dans la barre d'outils en haut.`, "error", 6000);
                    // Faire clignoter le champ de la clÃ© API
                    const inputField = currentApiProvider === 'gemini' ? controls.geminiApiKey : controls.chatgptApiKey;
                    if (inputField) {
                        inputField.style.animation = 'none';
                        setTimeout(() => {
                            inputField.style.animation = 'pulse 1s ease-in-out 3';
                        }, 10);
                    }
                    return false;
                }
                
                // Validation spÃ©cifique selon le fournisseur
                if (currentApiProvider === 'gemini') {
                    if (!apiKey.startsWith('AIza')) {
                        showNotification("âš ï¸ ClÃ© API Gemini invalide ! Elle doit commencer par 'AIza'. VÃ©rifiez votre clÃ© sur https://aistudio.google.com/app/apikey", "warning", 8000);
                        return false;
                    }
                    
                    if (apiKey.length < 30) {
                        showNotification("âš ï¸ ClÃ© API Gemini trop courte ! VÃ©rifiez votre clÃ©.", "warning", 5000);
                        return false;
                    }
                } else if (currentApiProvider === 'chatgpt') {
                    if (!apiKey.startsWith('sk-')) {
                        showNotification("âš ï¸ ClÃ© API OpenAI invalide ! Elle doit commencer par 'sk-'. VÃ©rifiez votre clÃ© sur https://platform.openai.com/api-keys", "warning", 8000);
                        return false;
                    }
                    
                    if (apiKey.length < 40) {
                        showNotification("âš ï¸ ClÃ© API OpenAI trop courte ! VÃ©rifiez votre clÃ©.", "warning", 5000);
                        return false;
                    }
                }
                
                return true;
            }

            // Fonction pour parser le JSON de l'IA de maniÃ¨re robuste
            function parseAIJsonSafely(text) {
                console.log("=== PARSING JSON ===");
                console.log("ðŸ“¥ Texte brut de l'IA (longueur: " + (text ? text.length : 0) + "):", text);
                
                // VÃ©rification initiale
                if (!text) {
                    console.error("âŒ ERREUR: Aucun texte reÃ§u de l'API (null/undefined)");
                    throw new Error("Aucune rÃ©ponse reÃ§ue de l'IA");
                }
                
                if (text.trim() === '') {
                    console.error("âŒ ERREUR: Texte vide reÃ§u de l'API");
                    throw new Error("RÃ©ponse vide de l'IA");
                }
                
                try {
                    // Nettoyer le texte avant parsing
                    let cleanText = text.trim();
                    console.log("ðŸ§¹ Texte aprÃ¨s trim (longueur: " + cleanText.length + "):", cleanText);
                    
                    // Supprimer les balises markdown si prÃ©sentes
                    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
                    cleanText = cleanText.replace(/```\s*/g, '');
                    console.log("ðŸ“ Texte aprÃ¨s suppression markdown:", cleanText);
                    
                    // Supprimer les commentaires de l'IA avant et aprÃ¨s le JSON
                    const jsonStart = cleanText.indexOf('{');
                    const jsonEnd = cleanText.lastIndexOf('}');
                    
                    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
                        console.error("âŒ ERREUR: Aucun JSON valide trouvÃ© dans la rÃ©ponse");
                        console.log("Contenu analysÃ©:", cleanText);
                        throw new Error("Format de rÃ©ponse invalide - aucun JSON trouvÃ©");
                    }
                    
                    cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
                    console.log("ðŸŽ¯ Texte final pour parsing (longueur: " + cleanText.length + "):", cleanText);
                    
                    if (cleanText.length === 0) {
                        console.error("âŒ ERREUR: Texte vide aprÃ¨s nettoyage complet");
                        throw new Error("JSON vide aprÃ¨s nettoyage");
                    }
                    
                    // VÃ©rifier que le JSON semble complet (ouverture et fermeture d'accolades)
                    const openBraces = (cleanText.match(/{/g) || []).length;
                    const closeBraces = (cleanText.match(/}/g) || []).length;
                    if (openBraces !== closeBraces) {
                        console.warn("âš ï¸ Avertissement: Nombre d'accolades dÃ©sÃ©quilibrÃ© (ouverture: " + openBraces + ", fermeture: " + closeBraces + ")");
                    }
                    
                    // Tentative de parsing
                    const parsed = JSON.parse(cleanText);
                    console.log("âœ… JSON parsÃ© avec succÃ¨s:", parsed);
                    
                    // VÃ©rifier que les donnÃ©es essentielles sont prÃ©sentes
                    // Pour les tests API, accepter si on a test et message
                    // Pour les donnÃ©es CV, accepter si on a nom, prenom, poste ou description
                    const hasTestData = parsed.test;
                    const hasCvData = parsed.nom || parsed.prenom || parsed.poste || parsed.description;
                    
                    if (parsed && (hasTestData || hasCvData)) {
                        console.log("âœ… DonnÃ©es validÃ©es:", { hasTestData, hasCvData });
                        return parsed;
                    } else {
                        console.log("âš ï¸ JSON valide mais donnÃ©es essentielles manquantes");
                        console.log("Contenu reÃ§u:", Object.keys(parsed || {}));
                        console.log("Valeurs reÃ§ues:", parsed);
                        throw new Error("DonnÃ©es incomplÃ¨tes reÃ§ues de l'IA - aucune donnÃ©e reconnaissable trouvÃ©e");
                    }
                    
                } catch (error) {
                    console.error("âŒ Erreur lors du parsing JSON:", error);
                    console.log("Texte qui a causÃ© l'erreur:", text);
                    console.log("Type d'erreur:", error.name);
                    console.log("Message d'erreur:", error.message);
                    
                    // Si c'est une erreur de syntaxe JSON, essayer de la corriger
                    if (error instanceof SyntaxError) {
                        console.log("ðŸ”§ Tentative de correction automatique du JSON...");
                        try {
                            // Extraire un JSON plus simple
                            let fallbackText = text.trim();
                            // Rechercher un pattern JSON plus flexible
                            const simpleJsonMatch = fallbackText.match(/\{[^{}]*\}/);
                            if (simpleJsonMatch) {
                                const simpleJson = JSON.parse(simpleJsonMatch[0]);
                                console.log("âœ… JSON simple rÃ©cupÃ©rÃ©:", simpleJson);
                                return simpleJson;
                            }
                        } catch (fallbackJsonError) {
                            console.log("âŒ Correction automatique JSON Ã©chouÃ©e:", fallbackJsonError);
                        }
                    }
                    
                    // Essayer une extraction simple avec regex comme fallback
                    try {
                        const fallbackData = extractDataFromText(text);
                        if (fallbackData.nom || fallbackData.prenom || fallbackData.poste || fallbackData.test) {
                            console.log("âœ… Fallback rÃ©ussi:", fallbackData);
                            return fallbackData;
                        }
                    } catch (fallbackError) {
                        console.log("âŒ Fallback a Ã©galement Ã©chouÃ©:", fallbackError);
                    }
                    
                    // Si tout Ã©choue, lancer l'erreur originale
                    throw error;
                }
            }
            
            // Fonction de fallback pour extraire des donnÃ©es du texte
            function extractDataFromText(text) {
                console.log("Extraction de fallback depuis le texte...");
                
                // D'abord essayer d'extraire des donnÃ©es de test API
                const testMatch = text.match(/test["\s:]*["']?([^"'\n]+)["']?/i);
                const messageMatch = text.match(/message["\s:]*["']?([^"'\n]+)["']?/i);
                
                if (testMatch) {
                    return {
                        test: testMatch[1].trim(),
                        message: messageMatch ? messageMatch[1].trim() : "API fonctionne"
                    };
                }
                
                // Ensuite extraction basique pour CV avec regex
                const nomMatch = text.match(/nom["\s:]*["']?([A-Z\s]+)["']?/i);
                const prenomMatch = text.match(/prenom["\s:]*["']?([A-Za-z\s]+)["']?/i);
                const posteMatch = text.match(/poste["\s:]*["']?([^"'\n]+)["']?/i);
                const descMatch = text.match(/description["\s:]*["']?([^"'\n]+)["']?/i);
                
                return {
                    nom: nomMatch ? nomMatch[1].trim().toUpperCase() : "",
                    prenom: prenomMatch ? prenomMatch[1].trim() : "",
                    poste: posteMatch ? posteMatch[1].trim() : "",
                    description: descMatch ? descMatch[1].trim() : "",
                    experiences: [],
                    formations: [],
                    competences: ""
                };
            }

            async function callAI(prompt, schema) {
                console.log(`=== APPEL API ${currentApiProvider.toUpperCase()} ===`);
                
                // VÃ©rifier la clÃ© API avant d'essayer l'appel
                if (!validateApiKey()) {
                    console.log("âŒ ClÃ© API invalide");
                    return null;
                }
                
                // Appeler l'API appropriÃ©e
                if (currentApiProvider === 'gemini') {
                    return await callGeminiAPI(prompt, schema);
                } else if (currentApiProvider === 'chatgpt') {
                    return await callChatGPTAPI(prompt, schema);
                } else {
                    throw new Error(`Fournisseur d'API non supportÃ©: ${currentApiProvider}`);
                }
            }

            async function callChatGPTAPI(prompt, schema) {
                console.log("=== APPEL API CHATGPT ===");
                
                const apiKey = getCurrentApiKey();
                console.log("ClÃ© API prÃ©sente:", !!apiKey);
                console.log("Longueur clÃ© API:", apiKey.length);
                
                // Lancer l'animation Matrix au lieu du loader
                showMatrixProcessing();
                try {
                    const apiUrl = 'https://api.openai.com/v1/chat/completions';
                    
                    // Construire le prompt avec les instructions pour le JSON si nÃ©cessaire
                    let systemPrompt = "Tu es un assistant IA expert en crÃ©ation de CV.";
                    let userPrompt = prompt;
                    
                    if (schema) {
                        systemPrompt += " Tu dois rÃ©pondre UNIQUEMENT avec du JSON valide selon le schÃ©ma fourni, sans texte supplÃ©mentaire.";
                        userPrompt += "\n\nImportant: RÃ©ponds UNIQUEMENT avec du JSON valide, sans markdown ni texte explicatif.";
                    }
                    
                    const payload = {
                        model: "gpt-3.5-turbo",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        temperature: 0.7,
                        max_tokens: 2000
                    };
                    
                    console.log("ðŸš€ Envoi de la requÃªte Ã  OpenAI...");
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    console.log("ðŸ“¡ Statut de la rÃ©ponse:", response.status);
                    
                    if (!response.ok) {
                        const errorBody = await response.text();
                        console.error("âŒ Erreur API OpenAI:", errorBody);
                        
                        if (response.status === 401) {
                            showNotification("âŒ ClÃ© API OpenAI invalide ! VÃ©rifiez votre clÃ©.", "error", 8000);
                            const inputField = controls.chatgptApiKey;
                            if (inputField) {
                                inputField.style.animation = 'pulse 1s ease-in-out 3';
                            }
                        } else if (response.status === 429) {
                            showNotification("âš ï¸ Limite de requÃªtes OpenAI atteinte. RÃ©essayez dans quelques minutes.", "warning", 8000);
                        } else {
                            showNotification(`âŒ Erreur API OpenAI (${response.status}): ${errorBody}`, "error", 8000);
                        }
                        throw new Error(`Erreur API OpenAI: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log("ðŸ“‹ RÃ©ponse complÃ¨te de l'API:", data);
                    
                    if (!data.choices || data.choices.length === 0) {
                        console.error("âŒ ERREUR: Pas de rÃ©ponse dans les choices");
                        throw new Error("RÃ©ponse API vide");
                    }
                    
                    const choice = data.choices[0];
                    if (!choice.message || !choice.message.content) {
                        console.error("âŒ ERREUR: Pas de contenu dans la rÃ©ponse");
                        throw new Error("Contenu de rÃ©ponse manquant");
                    }
                    
                    const text = choice.message.content;
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
                    throw error; // Re-throw pour permettre au code appelant de gÃ©rer l'erreur
                } finally {
                    hideMatrixProcessing();
                }
            }

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
                    throw er