
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
                    throw error; // Re-throw pour permettre au code appelant de gÃ©rer l'erreur
                } finally {
                    hideMatrixProcessing();
                }
            }

            async function generateAIColors() {
                if (!validateApiKey()) {
                    showNotification("Veuillez configurer votre clÃ© API Gemini d'abord.", "error");
                    return;
                }

                // RÃ©cupÃ©rer le contexte du CV pour des suggestions pertinentes
                const profession = document.getElementById('poste')?.value || 'professionnel';
                const sector = document.getElementById('description')?.value || '';
                
                const prompt = `En tant qu'expert en design et psychologie des couleurs, suggÃ¨re une palette de couleurs professionnelle pour un CV de ${profession}. 
                Contexte supplÃ©mentaire: ${sector}
                
                Recommande 3 couleurs:
                1. Couleur principale (primary) - pour les titres et Ã©lÃ©ments importants
                2. Couleur secondaire (secondary) - pour les sous-titres et accents
                3. Couleur du texte (body-text) - pour le contenu principal
                
                Les couleurs doivent Ãªtre professionnelles, lisibles et adaptÃ©es au secteur d'activitÃ©. 
                Fournis les couleurs au format hexadÃ©cimal (#RRGGBB).`;

                const schema = {
                    type: "OBJECT",
                    properties: {
                        primary: { type: "STRING", description: "Couleur principale en hexadÃ©cimal" },
                        secondary: { type: "STRING", description: "Couleur secondaire en hexadÃ©cimal" },
                        bodyText: { type: "STRING", description: "Couleur du texte principal en hexadÃ©cimal" },
                        reasoning: { type: "STRING", description: "Explication du choix des couleurs" }
                    },
                    required: ["primary", "secondary", "bodyText", "reasoning"]
                };

                try {
                    const result = await callGeminiAPI(prompt, schema);
                    if (result && result.primary && result.secondary && result.bodyText) {
                        // Appliquer les couleurs suggÃ©rÃ©es
                        const primaryPicker = document.getElementById('primary-color-picker');
                        const secondaryPicker = document.getElementById('secondary-color-picker');
                        const bodyTextPicker = document.getElementById('body-text-color-picker');
                        
                        if (primaryPicker) {
                            primaryPicker.value = result.primary;
                            primaryPicker.dispatchEvent(new Event('input'));
                        }
                        if (secondaryPicker) {
                            secondaryPicker.value = result.secondary;
                            secondaryPicker.dispatchEvent(new Event('input'));
                        }
                        if (bodyTextPicker) {
                            bodyTextPicker.value = result.bodyText;
                            bodyTextPicker.dispatchEvent(new Event('input'));
                        }

                        showNotification(`Palette IA appliquÃ©e ! ${result.reasoning}`, 'success', 8000);
                    } else {
                        showNotification("L'IA n'a pas pu gÃ©nÃ©rer de suggestions de couleurs.", 'error');
                    }
                } catch (error) {
                    console.error("Erreur lors de la gÃ©nÃ©ration des couleurs IA:", error);
                    showNotification("Erreur lors de la gÃ©nÃ©ration des couleurs IA", 'error');
                }
            }
            
            function updateAllStyles() {
                root.style.setProperty('--primary-color', controls.primaryColorPicker.value);
                root.style.setProperty('--secondary-color', controls.secondaryColorPicker.value);
                root.style.setProperty('--body-text-color', controls.bodyTextColorPicker.value);
                root.style.setProperty('--font-family-h1', controls.fontFamilyH1Select.value);
                root.style.setProperty('--font-family-h2', controls.fontFamilyH2Select.value);
                root.style.setProperty('--font-family-body', controls.fontFamilyBodySelect.value);

                const activeStyle = document.querySelector('.section-title-style-btn.active')?.dataset.titleStyle || 'style-underline';
                document.querySelectorAll('.section-title').forEach(title => {
                    title.classList.remove('style-underline', 'style-side-line', 'style-background', 'style-boxed');
                    title.classList.add(activeStyle);
                });
                
                const banner = preview.banner;
                const newBannerStyle = controls.bannerStyleSelect.value;
                const newAlign = document.querySelector('.banner-align-btn.active')?.dataset.bannerAlign || 'left';
                const isInverted = controls.bannerInvertBtn.classList.contains('active');

                const classesToRemove = Array.from(banner.classList).filter(c => c.startsWith('banner-style-'));
                if (classesToRemove.length > 0) banner.classList.remove(...classesToRemove);

                if (newBannerStyle) banner.classList.add(newBannerStyle);
                
                const contentWrapper = banner.querySelector('.banner-content-wrapper');
                contentWrapper.className = 'banner-content-wrapper'; // Reset classes
                contentWrapper.classList.add(`banner-align-${newAlign}`);
                if (isInverted) contentWrapper.classList.add('banner-layout-inverted');
                
                checkAllPagesOverflow();
            }

            function populateFontSelectors() {
                const fonts = [
                    { name: 'Lato', value: "'Lato', sans-serif" },
                    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
                    { name: 'Roboto Mono', value: "'Roboto Mono', monospace" },
                    { name: 'Playfair Display', value: "'Playfair Display', serif" },
                    { name: 'Merriweather', value: "'Merriweather', serif" },
                    { name: 'Oswald', value: "'Oswald', sans-serif" },
                    { name: 'Open Sans', value: "'Open Sans', sans-serif" },
                    { name: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
                    { name: 'Nunito Sans', value: "'Nunito Sans', sans-serif" },
                    { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
                ];
                const selects = [controls.fontFamilyH1Select, controls.fontFamilyH2Select, controls.fontFamilyBodySelect, controls.bannerNomFont];
                selects.forEach(select => {
                    if (!select) return;
                    select.innerHTML = '';
                    fonts.forEach(font => {
                        const option = document.createElement('option');
                        option.value = font.value;
                        option.textContent = font.name;
                        select.appendChild(option);
                    });
                });
            }
            
            function populateIconPicker() {
                const icons = ["fa-user-circle", "fa-briefcase", "fa-graduation-cap", "fa-star", "fa-puzzle-piece", "fa-globe", "fa-paint-brush", "fa-certificate", "fa-lightbulb", "fa-heart", "fa-cogs", "fa-code", "fa-chart-line", "fa-comments", "fa-bullhorn", "fa-trophy", "fa-book", "fa-wrench", "fa-users", "fa-award", "fa-phone", "fa-envelope", "fa-map-marker-alt", "fa-linkedin", "fa-github"];
                controls.iconPickerGrid.innerHTML = '';
                icons.forEach(iconClass => {
                    const iconEl = document.createElement('i');
                    iconEl.className = `fas ${iconClass}`;
                    iconEl.dataset.icon = `fas ${iconClass}`;
                    controls.iconPickerGrid.appendChild(iconEl);
                });
            }

            function resetCVToDefault() {
                document.querySelectorAll('.cv-input, .banner-input, .custom-section-input').forEach(input => {
                    if(input.type === 'checkbox') input.checked = false;
                    else if (input.type !== 'range' && input.type !== 'color') input.value = '';
                });
                
                controls.experienceList.innerHTML = '';
                controls.formationList.innerHTML = '';
                controls.customSectionsList.innerHTML = '';
                controls.skillsLevelList.innerHTML = '';
                
                document.querySelectorAll('.custom-module-preview').forEach(m => m.remove());
                
                setDefaultRecruiterInfo();
                applyTheme('professional');
                document.querySelector('.layout-btn[data-layout="layout-1-col"]').click();
                document.querySelector('.skill-style-btn[data-skill-style="tags"]').click();
                
                Object.values(sliders).forEach(config => {
                    const defaultValue = config.el.defaultValue;
                    config.el.value = defaultValue;
                    config.valueEl.textContent = defaultValue;
                    root.style.setProperty(config.property, `${defaultValue}${config.unit}`);
                });
                
                moveBannerTo('modular');
                removeBannerBackground();

                document.querySelectorAll('.completion-checkbox').forEach(cb => {
                    cb.checked = false;
                    cb.closest('details').open = true;
                });
                updateProgressBar();
                
                updatePreview('form');
                updateAllStyles();
                showNotification("Le CV a Ã©tÃ© rÃ©initialisÃ©.", "success");
            }

            function applyTheme(themeName) {
                const theme = themes[themeName];
                if (!theme) return;

                controls.primaryColorPicker.value = theme.primaryColor;
                controls.secondaryColorPicker.value = theme.secondaryColor;
                controls.bodyTextColorPicker.value = theme.bodyTextColor;
                controls.fontFamilyH1Select.value = theme.fontH1;
                controls.fontFamilyH2Select.value = theme.fontH2;
                controls.fontFamilyBodySelect.value = theme.fontBody;

                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                document.querySelector(`.theme-btn[data-theme="${themeName}"]`)?.classList.add('active');

                updateAllStyles();
                updatePreview('theme');
            }
            
            async function handleAIAction(action, moduleElement) {
                let prompt = '';
                let targetControl = null;

                switch (action) {
                    case 'rewrite-profile':
                        const profileText = controls.description.value;
                        if (!profileText) { showNotification("Le profil est vide.", "error"); return; }
                        prompt = `En tant qu'expert en recrutement, rÃ©Ã©cris ce profil de CV pour qu'il soit plus percutant et professionnel, en utilisant des verbes d'action forts. Garde une longueur similaire et un ton professionnel. Ne retourne que le paragraphe final rÃ©Ã©crit, sans aucun commentaire. Le profil actuel est : "${profileText}"`;
                        targetControl = controls.description;
                        const newProfile = await callGeminiAPI(prompt);
                        if (newProfile && targetControl) {
                            targetControl.value = newProfile;
                            showNotification("Profil amÃ©liorÃ© par l'IA.", "success");
                        }
                        break;
                    case 'summarize-experience':
                        await summarizeAllExperiencesAI();
                        break;
                    case 'rewrite-formation':
                        const formations = getDynamicData(controls.formationList);
                        if (formations.length === 0) { showNotification("Aucune formation Ã  amÃ©liorer.", "error"); return; }
                        const formationSchema = { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, meta: { type: "STRING" } } } };
                        const formationPrompt = `En tant qu'expert RH, amÃ©liore la formulation de ces entrÃ©es de formation pour un CV. Rends les titres plus percutants et les descriptions plus claires si nÃ©cessaire. Ne retourne que le rÃ©sultat final sous forme de tableau JSON \`[{"title": "...", "meta": "..."}]\` sans aucun commentaire ou texte additionnel. Voici les donnÃ©es actuelles : ${JSON.stringify(formations.map(f => ({ title: f.title, meta: f.meta })))}`;
                        const newFormations = await callGeminiAPI(formationPrompt, formationSchema);
                        if (newFormations && Array.isArray(newFormations)) {
                            controls.formationList.innerHTML = '';
                            newFormations.forEach(form => createDynamicItem(controls.formationList, [{ key: 'title', placeholder: 'Nom du diplÃ´me' }, { key: 'meta', placeholder: 'Ã‰tablissement & AnnÃ©e' }], form));
                            showNotification("Formations amÃ©liorÃ©es par l'IA.", "success");
                        }
                        break;
                    case 'rewrite-skills':
                        await synthesizeSkillsWithAI();
                        break;
                    default:
                        return;
                }
                updatePreview('form');
            }
            
            function setDefaultRecruiterInfo() {
                if (controls.bannerNom) controls.bannerNom.value = "Lyes AMARA";
                controls.bannerPoste.value = "Responsable dâ€™activitÃ© recrutement â€“ BTP â€“ France";
                controls.bannerEmail.value = "l.amara@ltd-international.com";
                controls.bannerTel.value = "01 56 02 12 25 / 06 34 25 32 96";
            }

            function anonymizeCV() {
                if (isAnonymized) {
                    controls.nom.value = originalData.nom;
                    controls.prenom.value = originalData.prenom;
                    
                    controls.anonymizeBtn.innerHTML = '<i class="fa-solid fa-user-secret"></i> Anonymiser le CV';
                    isAnonymized = false;
                    showNotification("CV dÃ©sanonymisÃ©.", "success");
                } else {
                    originalData = {
                        nom: controls.nom.value,
                        prenom: controls.prenom.value,
                    };
                    
                    const firstLetter = originalData.nom ? originalData.nom.charAt(0) + '.' : '';
                    controls.nom.value = firstLetter;
                    controls.prenom.value = originalData.prenom;
                    
                    controls.anonymizeBtn.innerHTML = '<i class="fa-solid fa-user-check"></i> DÃ©sanonymiser le CV';
                    isAnonymized = true;
                    showNotification("CV anonymisÃ©.", "success");
                }
                updatePreview('form');
            }

            // Fonctions de sauvegarde/chargement de presets banniÃ¨re
            function saveBannerPreset() {
                try {
                    const bannerPreset = {
                        style: controls.bannerStyleSelect.value,
                        alignment: preview.banner.classList.contains('banner-align-center') ? 'center' : 
                                  preview.banner.classList.contains('banner-align-right') ? 'right' : 'left',
                        isInverted: preview.banner.classList.contains('banner-layout-inverted'),
                        logoSize: getBannerLogoSize(),
                        elementSpacing: document.getElementById('banner-element-spacing').value,
                        backgroundImage: document.getElementById('banner-bg-img-preview').src !== 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=Photo' ? 
                                        document.getElementById('banner-bg-img-preview').src : null,
                        backgroundOpacity: document.getElementById('banner-bg-opacity').value,
                        backgroundBlur: document.getElementById('banner-bg-blur').value,
                        backgroundGrayscale: document.getElementById('banner-bg-grayscale').checked,
                        textStyles: {
                            nomFont: document.getElementById('banner-nom-font').value,
                            nomSize: document.getElementById('banner-nom-size').value,
                            nomColor: document.getElementById('banner-nom-color').value,
                            nomBold: document.getElementById('banner-nom-bold').classList.contains('active'),
                            nomItalic: document.getElementById('banner-nom-italic').classList.contains('active'),
                            posteSize: document.getElementById('banner-poste-size').value,
                            posteColor: document.getElementById('banner-poste-color').value,
                            posteBold: document.getElementById('banner-poste-bold').classList.contains('active'),
                            posteItalic: document.getElementById('banner-poste-italic').classList.contains('active'),
                            contactSize: document.getElementById('banner-contact-size').value,
                            contactColor: document.getElementById('banner-contact-color').value,
                            contactBold: document.getElementById('banner-contact-bold').classList.contains('active'),
                            contactItalic: document.getElementById('banner-contact-italic').classList.contains('active')
                        },
                        savedAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('banner-preset', JSON.stringify(bannerPreset));
                    showNotification("Configuration de banniÃ¨re sauvegardÃ©e !", "success");
                    return true;
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde du preset banniÃ¨re:', error);
                    showNotification("Erreur lors de la sauvegarde de la banniÃ¨re.", "error");
                    return false;
                }
            }

            function getBannerLogoSize() {
                const img = document.getElementById('banner-img-preview');
                if (img.classList.contains('logo-sm')) return 'sm';
                if (img.classList.contains('logo-md')) return 'md';
                if (img.classList.contains('logo-lg')) return 'lg';
                if (img.classList.contains('logo-xl')) return 'xl';
                if (img.classList.contains('logo-xxl')) return 'xxl';
                return 'md'; // default
            }

            function loadBannerPreset() {
                try {
                    const savedPreset = localStorage.getItem('banner-preset');
                    if (!savedPreset) {
                        showNotification("Aucune configuration de banniÃ¨re sauvegardÃ©e.", "warning");
                        return false;
                    }
                    
                    const preset = JSON.parse(savedPreset);
                    
                    // Restaurer le style
                    controls.bannerStyleSelect.value = preset.style;
                    
                    // Restaurer l'alignement
                    const alignButtons = document.querySelectorAll('.banner-align-btn');
                    alignButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
                    document.querySelector(`[data-banner-align="${preset.alignment}"]`).click();
                    
                    // Restaurer l'inversion
                    if (preset.isInverted) {
                        controls.bannerInvertBtn.click();
                    }
                    
                    // Restaurer la taille du logo
                    const logoSizeButtons = document.querySelectorAll('.logo-size-btn');
                    logoSizeButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
                    document.querySelector(`[data-logo-size="${preset.logoSize}"]`).click();
                    
                    // Restaurer l'espacement
                    document.getElementById('banner-element-spacing').value = preset.elementSpacing;
                    
                    // Restaurer l'image de fond si elle existe
                    if (preset.backgroundImage) {
                        document.getElementById('banner-bg-img-preview').src = preset.backgroundImage;
                        document.getElementById('banner-bg-opacity').value = preset.backgroundOpacity;
                        document.getElementById('banner-bg-blur').value = preset.backgroundBlur;
                        document.getElementById('banner-bg-grayscale').checked = preset.backgroundGrayscale;
                    }
                    
                    // Restaurer les styles de texte
                    const textStyles = preset.textStyles;
                    if (textStyles) {
                        document.getElementById('banner-nom-font').value = textStyles.nomFont;
                        document.getElementById('banner-nom-size').value = textStyles.nomSize;
                        document.getElementById('banner-nom-color').value = textStyles.nomColor;
                        
                        // RÃ©initialiser les styles
                        document.getElementById('banner-nom-bold').classList.remove('active');
                        document.getElementById('banner-nom-italic').classList.remove('active');
                        if (textStyles.nomBold) document.getElementById('banner-nom-bold').classList.add('active');
                        if (textStyles.nomItalic) document.getElementById('banner-nom-italic').classList.add('active');
                        
                        document.getElementById('banner-poste-size').value = textStyles.posteSize;
                        document.getElementById('banner-poste-color').value = textStyles.posteColor;
                        
                        document.getElementById('banner-poste-bold').classList.remove('active');
                        document.getElementById('banner-poste-italic').classList.remove('active');
                        if (textStyles.posteBold) document.getElementById('banner-poste-bold').classList.add('active');
                        if (textStyles.posteItalic) document.getElementById('banner-poste-italic').classList.add('active');
                        
                        document.getElementById('banner-contact-size').value = textStyles.contactSize;
                        document.getElementById('banner-contact-color').value = textStyles.contactColor;
                        
                        document.getElementById('banner-contact-bold').classList.remove('active');
                        document.getElementById('banner-contact-italic').classList.remove('active');
                        if (textStyles.contactBold) document.getElementById('banner-contact-bold').classList.add('active');
                        if (textStyles.contactItalic) document.getElementById('banner-contact-italic').classList.add('active');
                    }
                    
                    updatePreview('form');
                    showNotification("Configuration de banniÃ¨re chargÃ©e !", "success");
                    return true;
                } catch (error) {
                    console.error('Erreur lors du chargement du preset banniÃ¨re:', error);
                    showNotification("Erreur lors du chargement de la banniÃ¨re.", "error");
                    return false;
                }
            }

            // Fonctions de sauvegarde/chargement des informations recruteur
            function saveRecruiterInfo() {
                try {
                    const recruiterInfo = {
                        nom: controls.bannerNom.value,
                        poste: controls.bannerPoste.value,
                        email: controls.bannerEmail.value,
                        tel: controls.bannerTel.value,
                        photo: document.getElementById('banner-img-preview').src !== 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=Photo' ? 
                               document.getElementById('banner-img-preview').src : null,
                        savedAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('recruiter-info', JSON.stringify(recruiterInfo));
                    showNotification("Informations recruteur sauvegardÃ©es !", "success");
                    return true;
                } catch (error) {
                    console.error('Erreur lors de la sauvegarde des infos recruteur:', error);
                    showNotification("Erreur lors de la sauvegarde des informations.", "error");
                    return false;
                }
            }

            function loadRecruiterInfo() {
                try {
                    const savedInfo = localStorage.getItem('recruiter-info');
                    if (!savedInfo) {
                        showNotification("Aucune information recruteur sauvegardÃ©e.", "warning");
                        return false;
                    }
                    
                    const info = JSON.parse(savedInfo);
                    
                    controls.bannerNom.value = info.nom || '';
                    controls.bannerPoste.value = info.poste || '';
                    controls.bannerEmail.value = info.email || '';
                    controls.bannerTel.value = info.tel || '';
                    
                    if (info.photo) {
                        document.getElementById('banner-img-preview').src = info.photo;
                    }
                    
                    updatePreview('form');
                    showNotification("Informations recruteur chargÃ©es !", "success");
                    return true;
                } catch (error) {
                    console.error('Erreur lors du chargement des infos recruteur:', error);
                    showNotification("Erreur lors du chargement des informations.", "error");
                    return false;
                }
            }

            async function summarizeAllExperiencesAI() {
                const experienceItems = controls.experienceList.querySelectorAll('.data-desc');
                if (experienceItems.length === 0) {
                    showNotification("Aucune expÃ©rience Ã  rÃ©sumer.", "error");
                    return;
                }

                showLoader("SynthÃ¨se des expÃ©riences...");
                for (let i = 0; i < experienceItems.length; i++) {
                    const textarea = experienceItems[i];
                    const originalText = textarea.value;
                    if (originalText) {
                        const prompt = `RÃ©sume la description de cette mission professionnelle en 5 lignes maximum. Utilise des verbes d'action et un format de liste Ã  puces (chaque point commenÃ§ant par 'â€¢ '). Ne retourne que le texte final formatÃ© en liste Ã  puces, sans aucune phrase d'introduction, de conclusion ou de commentaire. Voici la description : "${originalText}"`;
                        const summary = await callGeminiAPI(prompt);
                        if (summary) {
                            textarea.value = summary;
                        }
                    }
                }
                hideLoader();
                updatePreview('form');
                showNotification("Toutes les expÃ©riences ont Ã©tÃ© synthÃ©tisÃ©es.", "success");
            }

            async function synthesizeSkillsWithAI() {
                const currentSkills = controls.competences.value;
                if (!currentSkills) {
                    showNotification("La liste de compÃ©tences est vide.", "error");
                    return;
                }
                const prompt = `Analyse cette liste de compÃ©tences de CV: "${currentSkills}". Regroupe-les par catÃ©gories pertinentes (ex: Langages, Frameworks, Outils, Logiciels, Langues, etc.). Retourne le rÃ©sultat sous la forme "CatÃ©gorie 1: compÃ©tence A, compÃ©tence B\nCatÃ©gorie 2: compÃ©tence C, compÃ©tence D". Ne retourne que le texte final formatÃ©, sans aucune phrase d'introduction, de conclusion ou de commentaire.`;

                const organizedSkills = await callGeminiAPI(prompt);
                if (organizedSkills) {
                    controls.competences.value = organizedSkills;
                    updatePreview('form');
                    showNotification("CompÃ©tences organisÃ©es par l'IA.", "success");
                }
            }

            async function limitSkillsWithAI() {
                const currentSkills = controls.competences.value;
                const jobTitle = controls.poste.value;
                if (!currentSkills) {
                    showNotification("La liste de compÃ©tences est vide.", "error");
                    return;
                }
                if (!jobTitle) {
                    showNotification("Veuillez renseigner le 'Poste recherchÃ©' pour de meilleurs rÃ©sultats.", "error");
                    return;
                }
                const prompt = `Ã€ partir de cette liste de compÃ©tences: "${currentSkills}", sÃ©lectionne les 10 compÃ©tences les plus importantes et pertinentes pour un poste de "${jobTitle}". Retourne uniquement la liste des 10 compÃ©tences, sÃ©parÃ©es par des virgules, sans aucune phrase d'introduction, de conclusion ou de commentaire.`;

                const limitedSkills = await callGeminiAPI(prompt);
                if (limitedSkills) {
                    controls.competences.value = limitedSkills;
                    updatePreview('form');
                    showNotification("CompÃ©tences limitÃ©es Ã  10 par l'IA.", "success");
                }
            }
            
            async function aiLayoutOptimization() {
                try {
                    // Lancer l'animation spectaculaire de restructuration
                    const animationPromise = showCVRestructureAnimation();
                    
                    // Attendre que l'animation dÃ©marre avant de continuer
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    showNotification("ðŸ§  IA : Analyse intelligente du contenu...", "info");
                    
                    // Ã‰TAPE 1: Analyse ultra-complÃ¨te du contenu avec scoring avancÃ©
                    const contentAnalysis = analyzeContentForLayoutAdvanced();
                    console.log("Analyse complÃ¨te du contenu:", contentAnalysis);
                    
                    // Ã‰TAPE 2: DÃ©cision intelligente du layout optimal avec justification
                    const optimalLayout = await chooseOptimalLayoutIntelligent(contentAnalysis);
                    showNotification(`ðŸ“Š Layout sÃ©lectionnÃ©: ${optimalLayout.name} (${optimalLayout.justification})`, "success");
                    
                    // Ã‰TAPE 3: Configuration automatique de la banniÃ¨re avec positionnement optimal
                    await configureBannerIntelligent(contentAnalysis, optimalLayout);
                    
                    // Ã‰TAPE 4: Optimisation complÃ¨te de l'utilisation de l'espace (marges, colonnes)
                    const spaceOptimization = await optimizePageSpaceIntelligent(contentAnalysis, optimalLayout);
                    showNotification(`ðŸ“ Espace optimisÃ©: ${spaceOptimization.strategy}`, "info");
                    
                    // Ã‰TAPE 5: Ajustement intelligent des tailles de police selon la densitÃ©
                    const fontOptimization = await optimizeFontsIntelligent(contentAnalysis, optimalLayout);
                    showNotification(`ðŸ”¤ Polices optimisÃ©es: ${fontOptimization.strategy}`, "info");
                    
                    // Ã‰TAPE 6: Reformulation automatique du contenu si nÃ©cessaire
                    if (contentAnalysis.needsContentReduction) {
                        await reformulateContentIntelligent(contentAnalysis);
                    }
                    
                    // Ã‰TAPE 7: RÃ©partition automatique des modules dans les colonnes
                    if (optimalLayout.columns > 1) {
                        await distributeModulesIntelligent(optimalLayout, contentAnalysis);
                    }
                    
                    // Ã‰TAPE 8: Optimisation fine des styles pour Ã©conomiser l'espace
                    await optimizeStylesForSpace(contentAnalysis);
                    
                    // Attendre la fin de l'animation avant les vÃ©rifications finales
                    await animationPromise;
                    
                    // Ã‰TAPE 9: Mise Ã  jour finale et vÃ©rifications
                    updatePreview('form');
                    
                    // Ã‰TAPE 10: VÃ©rifications multiples et ajustements progressifs jusqu'Ã  une page
                    setTimeout(async () => {
                        const finalResult = await ensureSinglePageCV(contentAnalysis, optimalLayout);
                        
                        let successMessage = `âœ¨ CV ULTRA-OPTIMISÃ‰ par l'IA ! 
ðŸ“Š Layout: ${optimalLayout.name} 
ðŸ“ Ratio colonnes: ${optimalLayout.ratio}
ðŸŽ¯ StratÃ©gie: ${finalResult.strategy}
âœ… Optimisations: ${finalResult.optimizations.join(', ')}`;
                        
                        if (finalResult.isOnePage) {
                            successMessage += "\nðŸŽ‰ OBJECTIF ATTEINT: CV sur une seule page !";
                            showNotification(successMessage, "success", 10000);
                        } else {
                            successMessage += "\nâš ï¸ Contenu trÃ¨s dense - quelques ajustements manuels peuvent Ãªtre nÃ©cessaires";
                            showNotification(successMessage, "warning", 8000);
                        }
                    }, 500);
                    
                } catch (error) {
                    // Masquer l'animation en cas d'erreur
                    hideCVRestructureAnimation();
                    console.error('Erreur lors de l\'optimisation layout:', error);
                    showNotification("Erreur lors de l'optimisation intelligente du layout", "error");
                }
            }
            
            function triggerSliderChange(sliderId, newValue) {
                const slider = document.getElementById(sliderId);
                const valueDisplay = document.getElementById(sliderId + '-value');
                
                if (slider && valueDisplay) {
                    slider.value = newValue;
                    valueDisplay.textContent = newValue;
                    
                    // DÃ©clencher l'Ã©vÃ©nement change/input pour que les listeners existants se dÃ©clenchent
                    slider.dispatchEvent(new Event('input', { bubbles: true }));
                    slider.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }

            // --- NOUVELLES FONCTIONS D'OPTIMISATION INTELLIGENTE ---
            
            async function optimizePageWidth(contentAnalysis) {
                console.log("Optimisation de la largeur de page...");
                
                // Maximiser l'utilisation de l'espace avec des marges rÃ©duites
                if (contentAnalysis.density > 0.5) {
                    // Pour un contenu dense, utiliser toute la largeur disponible
                    triggerSliderChange('page-margin', 1.5); // RÃ©duire les marges
                    showNotification("ðŸ“ Largeur de page optimisÃ©e - marges rÃ©duites", "info");
                } else {
                    // Pour un contenu lÃ©ger, garder des marges standard
                    triggerSliderChange('page-margin', 2.0);
                }
            }
            
            async function reformulateContentWithAI(contentAnalysis) {
                if (!validateApiKey()) {
                    console.log("Pas d'API key - saut de la reformulation");
                    return;
                }
                
                console.log("Reformulation automatique du contenu...");
                showNotification("ðŸ¤– Reformulation intelligente du contenu...", "info");
                
                // Reformuler les descriptions d'expÃ©rience trop longues
                const experienceItems = controls.experienceList.querySelectorAll('.experience-item');
                for (let item of experienceItems) {
                    const descTextarea = item.querySelector('[data-field="desc"]');
                    if (descTextarea && descTextarea.value.length > 300) {
                        const originalDesc = descTextarea.value;
                        const prompt = `Reformule cette description d'expÃ©rience professionnelle en la condensant Ã  maximum 3 lignes tout en gardant l'essentiel. Utilise des verbes d'action et sois concis. Format: liste Ã  puces avec â€¢ . Description: "${originalDesc}"`;
                        
                        try {
                            const condensedDesc = await callGeminiAPI(prompt);
                            if (condensedDesc) {
                                descTextarea.value = condensedDesc;
                                showNotification("âœ‚ï¸ Description condensÃ©e automatiquement", "success");
                            }
                        } catch (error) {
                            console.error("Erreur reformulation:", error);
                        }
                    }
                }
                
                // Reformuler la description gÃ©nÃ©rale si elle est trop longue
                if (controls.description.value.length > 400) {
                    const originalDesc = controls.description.value;
                    const prompt = `Reformule cette description de profil professionnel en la condensant Ã  maximum 4 lignes tout en gardant l'impact. Sois percutant et concis. Description: "${originalDesc}"`;
                    
                    try {
                        const condensedProfile = await callGeminiAPI(prompt);
                        if (condensedProfile) {
                            controls.description.value = condensedProfile;
                            showNotification("ðŸ“ Profil condensÃ© automatiquement", "success");
                        }
                    } catch (error) {
                        console.error("Erreur reformulation profil:", error);
                    }
                }
            }
            
            async function chooseOptimalLayoutAndDistribution(contentAnalysis) {
                console.log("Choix du layout optimal et rÃ©partition des blocs...");
                
                let layoutChoice, distribution, optimizations = [];
                
                // Logique intelligente pour le choix du layout
                if (contentAnalysis.density > 0.8) {
                    // TrÃ¨s dense - 2 colonnes 33/67 pour maximiser l'espace
                    layoutChoice = '2-col-33-67';
                    distribution = "Colonne gauche: Contact + CompÃ©tences + Formation | Colonne droite: ExpÃ©riences dÃ©taillÃ©es";
                    optimizations.push("2 colonnes 33/67", "RÃ©partition optimisÃ©e", "Espace maximisÃ©");
                } else if (contentAnalysis.density > 0.6) {
                    // Dense - 2 colonnes Ã©quilibrÃ©es
                    layoutChoice = '2-col-50-50';
                    distribution = "Colonnes Ã©quilibrÃ©es pour un contenu Ã©quilibrÃ©";
                    optimizations.push("2 colonnes Ã©quilibrÃ©es", "RÃ©partition harmonieuse");
                } else if (contentAnalysis.density > 0.3) {
                    // ModÃ©rÃ© - 2 colonnes 67/33 pour aÃ©rer
                    layoutChoice = '2-col-67-33';
                    distribution = "Colonne principale large pour un contenu aÃ©rÃ©";
                    optimizations.push("2 colonnes 67/33", "Contenu aÃ©rÃ©");
                } else {
                    // LÃ©ger - 1 colonne pour simplicitÃ©
                    layoutChoice = '1-col';
                    distribution = "Colonne unique pour un contenu simple et clair";
                    optimizations.push("Colonne unique", "Design Ã©purÃ©");
                }
                
                // Appliquer le layout choisi
                const layoutButtons = document.querySelectorAll('.layout-btn');
                layoutButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
                const layoutBtn = document.querySelector(`[data-layout="${layoutChoice}"]`);
                if (layoutBtn) {
                    layoutBtn.click();
                    showNotification(`ðŸ“Š Layout optimisÃ©: ${layoutChoice}`, "success");
                }
                
                // Si on utilise 2 colonnes, optimiser la rÃ©partition des modules
                if (layoutChoice.includes('2-col')) {
                    await optimizeModuleDistribution(layoutChoice, contentAnalysis);
                    optimizations.push("Modules rÃ©partis intelligemment");
                }
                
                return {
                    layout: layoutChoice,
                    description: distribution,
                    optimizations: optimizations
                };
            }
            
            async function optimizeModuleDistribution(layoutType, contentAnalysis) {
                // Cette fonction pourrait Ãªtre Ã©tendue pour dÃ©placer automatiquement les modules
                // entre les colonnes selon le type de layout et le contenu
                console.log(`Optimisation de la rÃ©partition des modules pour ${layoutType}`);
                
                // Logique future pour le drag & drop automatique des modules
                // En fonction du layout choisi et du contenu analysÃ©
                
                let recommendedDistribution = "";
                if (layoutType === '2-col-33-67') {
                    recommendedDistribution = "Colonne Ã©troite (33%): Informations personnelles, compÃ©tences, formation. Colonne large (67%): ExpÃ©riences, projets.";
                } else if (layoutType === '2-col-50-50') {
                    recommendedDistribution = "RÃ©partition Ã©quilibrÃ©e: Alternance des sections pour un Ã©quilibre visuel.";
                } else if (layoutType === '2-col-67-33') {
                    recommendedDistribution = "Colonne large (67%): Contenu principal. Colonne Ã©troite (33%): Informations complÃ©mentaires.";
                }
                
                showNotification(`ðŸŽ¯ RÃ©partition recommandÃ©e: ${recommendedDistribution}`, "info", 5000);
            }
            
            async function emergencyContentOptimization() {
                console.log("Optimisations d'urgence pour Ã©viter le dÃ©bordement...");
                
                // Ajustements progressifs plus intelligents
                const currentPSize = parseFloat(document.getElementById('font-size-p').value);
                const currentModuleSpacing = parseFloat(document.getElementById('module-spacing').value);
                const currentPageMargin = parseFloat(document.getElementById('page-margin').value);
                
                // 1. RÃ©duire les marges de page
                if (currentPageMargin > 1.0) {
                    triggerSliderChange('page-margin', Math.max(1.0, currentPageMargin - 0.3));
                    showNotification("ðŸ“ Marges rÃ©duites d'urgence", "warning");
                }
                
                // 2. RÃ©duire l'espacement entre modules
                if (currentModuleSpacing > 0.8) {
                    triggerSliderChange('module-spacing', Math.max(0.8, currentModuleSpacing - 0.3));
                    showNotification("ðŸ“ Espacement rÃ©duit d'urgence", "warning");
                }
                
                // 3. RÃ©duire lÃ©gÃ¨rement la taille de police
                if (currentPSize > 8.5) {
                    triggerSliderChange('font-size-p', Math.max(8.5, currentPSize - 0.5));
                    showNotification("ðŸ”¤ Taille de police rÃ©duite d'urgence", "warning");
                }
                
                // 4. Si toujours pas suffisant, reformuler automatiquement
                updatePreview('form');
                await new Promise(resolve => setTimeout(resolve, 500));
                
                if (checkPageOverflow()) {
                    if (validateApiKey()) {
                        await reformulateContentWithAI({ density: 1.0 }); // Force reformulation
                        showNotification("ðŸ¤– Reformulation automatique d'urgence", "warning");
                    } else {
                        showNotification("âš ï¸ Contenu toujours trop long - reformulation manuelle nÃ©cessaire", "error");
                    }
                }
            }
            
            function analyzeContentForLayoutAdvanced() {
                // Analyse ultra-complÃ¨te avec scoring avancÃ© pour optimisation intelligente
                const description = controls.description.value || '';
                const competences = controls.competences.value || '';
                const experiences = Array.from(controls.experienceList.querySelectorAll('[data-field="desc"]')).map(el => el.value).join(' ');
                const formations = Array.from(controls.formationList.querySelectorAll('[data-field="desc"]')).map(el => el.value).join(' ');
                
                const totalContent = description + competences + experiences + formations;
                const totalChars = totalContent.length;
                
                // Comptage dÃ©taillÃ© des Ã©lÃ©ments
                const expCount = controls.experienceList.querySelectorAll('.experience-item').length;
                const formCount = controls.formationList.querySelectorAll('.formation-item').length;
                const skillsCount = competences.split(',').filter(s => s.trim()).length;
                
                // Analyse fine des descriptions
                const expDescriptions = Array.from(controls.experienceList.querySelectorAll('[data-field="desc"]')).map(el => el.value);
                const avgExpLength = expDescriptions.length > 0 ? expDescriptions.reduce((sum, desc) => sum + desc.length, 0) / expDescriptions.length : 0;
                const maxExpLength = expDescriptions.length > 0 ? Math.max(...expDescriptions.map(desc => desc.length)) : 0;
                
                // Calcul de densitÃ© multi-facteurs (0-1)
                let densityScore = 0;
                densityScore += Math.min(totalChars / 3500, 1) * 0.35;  // CaractÃ¨res total
                densityScore += Math.min(expCount / 6, 1) * 0.25;       // Nombre d'expÃ©riences
                densityScore += Math.min(avgExpLength / 350, 1) * 0.2;  // Longueur moyenne
                densityScore += Math.min(formCount / 5, 1) * 0.1;       // Formations
                densityScore += Math.min(skillsCount / 30, 1) * 0.1;    // CompÃ©tences
                
                // Score de complexitÃ© visuelle
                const visualComplexity = (expCount * 0.4) + (formCount * 0.3) + (skillsCount / 5 * 0.3);
                
                // PrÃ©diction de la stratÃ©gie optimale
                let optimalStrategy;
                if (densityScore > 0.8) optimalStrategy = 'ultra-compress';
                else if (densityScore > 0.6) optimalStrategy = 'compress';
                else if (densityScore > 0.4) optimalStrategy = 'balance';
                else if (densityScore > 0.2) optimalStrategy = 'expand';
                else optimalStrategy = 'minimal';
                
                // Analyse de la rÃ©partition idÃ©ale des colonnes
                const leftColumnContent = competences.length + (description.length * 0.3);
                const rightColumnContent = experiences.length + formations.length;
                const balanceRatio = leftColumnContent / (leftColumnContent + rightColumnContent);
                
                return {
                    density: Math.min(densityScore, 1),
                    totalChars,
                    expCount,
                    formCount,
                    skillsCount,
                    avgExpLength,
                    maxExpLength,
                    visualComplexity,
                    strategy: optimalStrategy,
                    balanceRatio,
                    contentDistribution: {
                        experiences: experiences.length,
                        formations: formations.length,
                        competences: competences.length,
                        description: description.length
                    },
                    needsContentReduction: maxExpLength > 280 || avgExpLength > 180 || totalChars > 3000,
                    pageUtilization: densityScore,
                    recommendedColumns: densityScore > 0.5 ? 2 : 1,
                    estimatedPageUsage: Math.min((densityScore * 1.3) + 0.2, 1.1)  // Estimation si dÃ©passe 1 page
                };
            }
            
            async function chooseOptimalLayoutIntelligent(analysis) {
                console.log("ðŸ§  Choix intelligent du layout optimal...");
                
                let layout, justification, ratio;
                
                // Logique ultra-intelligente basÃ©e sur l'analyse complÃ¨te
                if (analysis.density > 0.85) {
                    // Ultra-dense : prioritÃ© Ã  l'efficacitÃ© d'espace
                    layout = '2-col-33-67';
                    ratio = '33/67';
                    justification = "Contenu trÃ¨s dense - colonne Ã©troite pour infos compactes, large pour dÃ©tails";
                } else if (analysis.density > 0.7) {
                    // Dense : Ã©quilibrer lisibilitÃ© et espace
                    if (analysis.balanceRatio > 0.4) {
                        layout = '2-col-50-50';
                        ratio = '50/50';
                        justification = "Contenu Ã©quilibrÃ© - colonnes Ã©gales pour rÃ©partition harmonieuse";
                    } else {
                        layout = '2-col-33-67';
                        ratio = '33/67';
                        justification = "Plus d'expÃ©riences - prioritÃ© Ã  la colonne principale";
                    }
                } else if (analysis.density > 0.45) {
                    // ModÃ©rÃ© : privilÃ©gier la lisibilitÃ©
                    if (analysis.expCount > analysis.formCount + 2) {
                        layout = '2-col-67-33';
                        ratio = '67/33';
                        justification = "Beaucoup d'expÃ©riences - colonne large pour le contenu principal";
                    } else {
                        layout = '2-col-50-50';
                        ratio = '50/50';
                        justification = "Contenu modÃ©rÃ© - Ã©quilibre optimal";
                    }
                } else if (analysis.density > 0.25) {
                    // LÃ©ger : maximiser l'impact visuel
                    layout = '2-col-67-33';
                    ratio = '67/33';
                    justification = "Contenu lÃ©ger - colonne large pour impact visuel";
                } else {
                    // Minimal : clartÃ© absolue
                    layout = '1-col';
                    ratio = '100';
                    justification = "Contenu minimal - colonne unique pour clartÃ© maximale";
                }
                
                // Application du layout avec animation
                const layoutButtons = document.querySelectorAll('.layout-btn');
                layoutButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
                const layoutBtn = document.querySelector(`[data-layout="${layout}"]`);
                if (layoutBtn) {
                    layoutBtn.click();
                }
                
                return {
                    type: layout,
                    name: layout === '1-col' ? 'Colonne unique' : `2 colonnes ${ratio}`,
                    ratio: ratio,
                    justification: justification,
                    columns: layout === '1-col' ? 1 : 2,
                    primaryColumn: layout.includes('67-33') ? 'left' : layout.includes('33-67') ? 'right' : 'balanced'
                };
            }
            
            async function configureBannerIntelligent(analysis, layout) {
                console.log("ðŸŽ¯ Configuration intelligente de la banniÃ¨re...");
                
                // Activation automatique de la banniÃ¨re
                if (!controls.toggleBanner.checked) {
                    controls.toggleBanner.checked = true;
                    showNotification("ðŸ“¢ BanniÃ¨re activÃ©e automatiquement", "info");
                }
                
                // Configuration automatique des informations manquantes
                if ((!controls.bannerNom || !controls.bannerNom.value) || (!controls.bannerEmail || !controls.bannerEmail.value)) {
                    setDefaultRecruiterInfo();
                }
                
                // Choix intelligent du style de banniÃ¨re selon la densitÃ©
                let bannerStyle, bannerPosition, logoSize;
                
                if (analysis.density > 0.8) {
                    // Ultra-compact pour contenu dense
                    bannerStyle = 'banner-style-minimal';
                    bannerPosition = 'bottom';  // En bas pour ne pas gÃªner
                    logoSize = 'logo-sm';
                    showNotification("ðŸ“ Style banniÃ¨re: Minimal (optimisÃ© pour contenu dense)", "info");
                } else if (analysis.density > 0.6) {
                    // Ã‰quilibrÃ©
                    bannerStyle = 'banner-style-modern';
                    bannerPosition = analysis.strategy === 'compress' ? 'bottom' : 'top';
                    logoSize = 'logo-md';
                    showNotification("ðŸŽ¨ Style banniÃ¨re: Moderne (Ã©quilibrÃ©)", "info");
                } else {
                    // GÃ©nÃ©reux pour contenu lÃ©ger
                    bannerStyle = 'banner-style-elegant';
                    bannerPosition = 'top';
                    logoSize = 'logo-lg';
                    showNotification("âœ¨ Style banniÃ¨re: Ã‰lÃ©gant (design aÃ©rÃ©)", "info");
                }
                
                // Application des paramÃ¨tres
                if (controls.bannerStyleSelect) {
                    controls.bannerStyleSelect.value = bannerStyle;
                }
                
                // Application de la position de la banniÃ¨re
                if (bannerPosition === 'top') {
                    if (controls.fixBannerTopBtn) {
                        controls.fixBannerTopBtn.click();
                    }
                } else if (bannerPosition === 'bottom') {
                    if (controls.fixBannerBottomBtn) {
                        controls.fixBannerBottomBtn.click();
                    }
                }
                
                // Configuration du logo si prÃ©sent
                if (preview && preview.bannerImg && preview.bannerImg.src) {
                    preview.bannerImg.className = `${logoSize}`;
                }
                
                // Alignement intelligent selon le layout
                let alignment = 'center';
                if (layout.type === '2-col-33-67') alignment = 'left';
                else if (layout.type === '2-col-67-33') alignment = 'right';
                
                const alignButtons = document.querySelectorAll('.banner-align-btn');
                alignButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'text-white'));
                const alignBtn = document.querySelector(`[data-align="${alignment}"]`);
                if (alignBtn) {
                    alignBtn.classList.add('active', 'bg-blue-500', 'text-white');
                    alignBtn.click();
                }
            }
            
            async function optimizePageSpaceIntelligent(analysis, layout) {
                console.log("ðŸ“ Optimisation intelligente de l'espace page...");
                
                let margins, strategy;
                
                // StratÃ©gie d'optimisation de l'espace basÃ©e sur l'analyse
                switch (analysis.strategy) {
                    case 'ultra-compress':
                        margins = 1.0;  // Marges minimales pour utiliser tout l'espace
                        strategy = "Marges ultra-rÃ©duites (1cm) - Utilisation maximale de l'espace";
                        break;
                    case 'compress':
                        margins = 1.3;  // Marges rÃ©duites mais lisibles
                        strategy = "Marges rÃ©duites (1.3cm) - Bon compromis espace/lisibilitÃ©";
                        break;
                    case 'balance':
                        margins = 1.7;  // Marges Ã©quilibrÃ©es
                        strategy = "Marges Ã©quilibrÃ©es (1.7cm) - Confort de lecture";
                        break;
                    case 'expand':
                        margins = 2.0;  // Marges standard
                        strategy = "Marges standard (2cm) - Design aÃ©rÃ©";
                        break;
                    default:
                        margins = 2.5;  // Marges gÃ©nÃ©reuses
                        strategy = "Marges gÃ©nÃ©reuses (2.5cm) - Maximum d'Ã©lÃ©gance";
                        break;
                }
                
                // Application des marges optimisÃ©es
                triggerSliderChange('page-margin', margins);
                
                return { strategy, margins };
            }
            
            async function optimizeFontsIntelligent(analysis, layout) {
                console.log("ðŸ”¤ Optimisation intelligente des polices...");
                
                let fonts, strategy;
                
                // Calcul intelligent des tailles selon la stratÃ©gie
                switch (analysis.strategy) {
                    case 'ultra-compress':
                        fonts = { h1: 22, h2: 14, p: 8, banner: 7.5 };
                        strategy = "Polices ultra-compactes - Maximum de contenu";
                        break;
                    case 'compress':
                        fonts = { h1: 26, h2: 15.5, p: 8.5, banner: 8 };
                        strategy = "Polices compactes - Bon compromis";
                        break;
                    case 'balance':
                        fonts = { h1: 30, h2: 17, p: 9.5, banner: 9 };
                        strategy = "Polices Ã©quilibrÃ©es - LisibilitÃ© optimale";
                        break;
                    case 'expand':
                        fonts = { h1: 34, h2: 19, p: 10.5, banner: 9.5 };
                        strategy = "Polices gÃ©nÃ©reuses - Confort de lecture";
                        break;
                    default:
                        fonts = { h1: 38, h2: 21, p: 11, banner: 10 };
                        strategy = "Polices Ã©lÃ©gantes - Impact visuel maximum";
                        break;
                }
                
                // Ajustements fins selon le layout
                if (layout.columns === 2) {
                    fonts.h1 -= 2;  // RÃ©duction pour colonnes
                    fonts.h2 -= 1;
                }
                
                // Application des tailles optimisÃ©es
                triggerSliderChange('font-size-h1', fonts.h1);
                triggerSliderChange('font-size-h2', fonts.h2);
                triggerSliderChange('font-size-p', fonts.p);
                triggerSliderChange('font-size-banner', fonts.banner);
                
                return { strategy, fonts };
            }
            
            async function reformulateContentIntelligent(analysis) {
                if (!validateApiKey()) {
                    showNotification("ðŸ”‘ API key requise pour la reformulation automatique", "warning");
                    return;
                }
                
                console.log("ðŸ¤– Reformulation intelligente du contenu...");
                showNotification("ðŸ§  IA: Reformulation intelligente en cours...", "info");
                
                let reformulationCount = 0;
                
                // Reformulation ciblÃ©e des expÃ©riences trop longues
                const experienceItems = controls.experienceList.querySelectorAll('.experience-item');
                for (let item of experienceItems) {
                    const descTextarea = item.querySelector('[data-field="desc"]');
                    if (descTextarea && descTextarea.value.length > 280) {
                        const originalDesc = descTextarea.value;
                        const targetLength = analysis.strategy === 'ultra-compress' ? '2 lignes maximum' : '3 lignes maximum';
                        
                        const prompt = `Reformule cette description d'expÃ©rience en la condensant Ã  ${targetLength}. Garde seulement l'essentiel, utilise des verbes d'action percutants et des bullet points avec â€¢. Reste professionnel et impactant. Description: "${originalDesc}"`;
                        
                        try {
                            const condensedDesc = await callGeminiAPI(prompt);
                            if (condensedDesc) {
                                descTextarea.value = condensedDesc;
                                reformulationCount++;
                            }
                        } catch (error) {
                            console.error("Erreur reformulation expÃ©rience:", error);
                        }
                    }
                }
                
                // Reformulation du profil si nÃ©cessaire
                if (controls.description.value.length > 350) {
                    const originalDesc = controls.description.value;
                    const targetLength = analysis.strategy === 'ultra-compress' ? '3 lignes' : '4 lignes';
                    
                    const prompt = `Reformule ce profil professionnel en le condensant Ã  ${targetLength} maximum. Garde l'impact et la personnalitÃ©, mais sois plus concis et percutant. Profil: "${originalDesc}"`;
                    
                    try {
                        const condensedProfile = await callGeminiAPI(prompt);
                        if (condensedProfile) {
                            controls.description.value = condensedProfile;
                            reformulationCount++;
                        }
                    } catch (error) {
                        console.error("Erreur reformulation profil:", error);
                    }
                }
                
                if (reformulationCount > 0) {
                    showNotification(`âœ‚ï¸ ${reformulationCount} sections reformulÃ©es intelligemment`, "success");
                }
            }
            
            async function distributeModulesIntelligent(layout, analysis) {
                console.log("ðŸŽ¯ RÃ©partition intelligente des modules...");
                
                // Recommandations basÃ©es sur le type de layout et le contenu
                let recommendation = "";
                
                switch (layout.type) {
                    case '2-col-33-67':
                        recommendation = "Colonne Ã©troite (33%): Contact, CompÃ©tences, Formation | Colonne large (67%): ExpÃ©riences, Projets, Description dÃ©taillÃ©e";
                        break;
                    case '2-col-50-50':
                        recommendation = "RÃ©partition Ã©quilibrÃ©e: Alternez les sections pour un Ã©quilibre visuel optimal";
                        break;
                    case '2-col-67-33':
                        recommendation = "Colonne large (67%): ExpÃ©riences principales, Description | Colonne Ã©troite (33%): Contact, CompÃ©tences";
                        break;
                }
                
                if (recommendation) {
                    showNotification(`ðŸŽ¯ RÃ©partition recommandÃ©e: ${recommendation}`, "info", 6000);
                }
                
                // TODO: ImplÃ©mentation future du drag & drop automatique
                // Cette fonction pourrait Ãªtre Ã©tendue pour dÃ©placer automatiquement les modules
            }
            
            async function optimizeStylesForSpace(analysis) {
                console.log("ðŸŽ¨ Optimisation des styles pour Ã©conomiser l'espace...");
                
                // Choix intelligent du style de titre selon la stratÃ©gie
                let titleStyle;
                switch (analysis.strategy) {
                    case 'ultra-compress':
                    case 'compress':
                        titleStyle = 'style-side-line';  // Plus compact
                        break;
                    case 'balance':
                        titleStyle = 'style-underline';  // Ã‰quilibrÃ©
                        break;
                    default:
                        titleStyle = 'style-background';  // Plus visible
                        break;
                }
                
                // Application du style de titre
                const titleButtons = document.querySelectorAll('.section-title-style-btn');
                titleButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'text-white'));
                const titleBtn = document.querySelector(`[data-title-style="${titleStyle}"]`);
                if (titleBtn) {
                    titleBtn.classList.add('active', 'bg-blue-500', 'text-white');
                    titleBtn.click();
                }
                
                // Optimisation des espacements selon la stratÃ©gie
                let spacing;
                switch (analysis.strategy) {
                    case 'ultra-compress':
                        spacing = { module: 0.8, paragraph: 0.2, banner: 0.6 };
                        break;
                    case 'compress':
                        spacing = { module: 1.0, paragraph: 0.3, banner: 0.8 };
                        break;
                    case 'balance':
                        spacing = { module: 1.3, paragraph: 0.4, banner: 1.0 };
                        break;
                    default:
                        spacing = { module: 1.6, paragraph: 0.5, banner: 1.2 };
                        break;
                }
                
                triggerSliderChange('module-spacing', spacing.module);
                triggerSliderChange('paragraph-spacing', spacing.paragraph);
                triggerSliderChange('banner-element-spacing', spacing.banner);
                
                showNotification(`ðŸŽ¨ Styles optimisÃ©s: ${titleStyle}, espacement ${analysis.strategy}`, "info");
            }
            
            async function ensureSinglePageCV(analysis, layout) {
                console.log("ðŸŽ¯ VÃ©rification finale et ajustements pour une page...");
                
                const maxAttempts = 5;
                let attempt = 0;
                let optimizations = [];
                let strategy = "Optimisation standard";
                
                while (attempt < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 300)); // Laisser le DOM se mettre Ã  jour
                    
                    const isOverflowing = checkPageOverflow();
                    
                    if (!isOverflowing) {
                        return {
                            isOnePage: true,
                            strategy: strategy,
                            optimizations: optimizations,
                            attempts: attempt
                        };
                    }
                    
                    attempt++;
                    console.log(`Tentative ${attempt}/${maxAttempts} d'optimisation pour une page`);
                    
                    switch (attempt) {
                        case 1:
                            // Niveau 1: RÃ©duction des marges
                            const currentMargin = parseFloat(document.getElementById('page-margin').value);
                            if (currentMargin > 1.0) {
                                triggerSliderChange('page-margin', Math.max(1.0, currentMargin - 0.4));
                                optimizations.push("Marges rÃ©duites");
                                strategy = "RÃ©duction marges";
                            }
                            break;
                            
                        case 2:
                            // Niveau 2: Compression des espacements
                            triggerSliderChange('module-spacing', 0.8);
                            triggerSliderChange('paragraph-spacing', 0.2);
                            optimizations.push("Espacements compressÃ©s");
                            strategy = "Compression espacements";
                            break;
                            
                        case 3:
                            // Niveau 3: RÃ©duction des polices
                            const currentH1 = parseFloat(document.getElementById('font-size-h1').value);
                            const currentP = parseFloat(document.getElementById('font-size-p').value);
                            triggerSliderChange('font-size-h1', Math.max(20, currentH1 - 3));
                            triggerSliderChange('font-size-h2', Math.max(13, currentP + 4));
                            triggerSliderChange('font-size-p', Math.max(7.5, currentP - 0.5));
                            optimizations.push("Polices rÃ©duites");
                            strategy = "Compression polices";
                            break;
                            
                        case 4:
                            // Niveau 4: Reformulation d'urgence si API disponible
                            if (validateApiKey()) {
                                await reformulateContentUrgent(analysis);
                                optimizations.push("Reformulation d'urgence");
                                strategy = "Reformulation IA d'urgence";
                            } else {
                                // Sinon, ajustements maximaux
                                triggerSliderChange('page-margin', 0.8);
                                triggerSliderChange('module-spacing', 0.6);
                                optimizations.push("Compression maximale");
                                strategy = "Compression maximale";
                            }
                            break;
                            
                        case 5:
                            // Niveau 5: Ajustements extrÃªmes
                            triggerSliderChange('font-size-p', 7);
                            triggerSliderChange('paragraph-spacing', 0.1);
                            triggerSliderChange('page-margin', 0.7);
                            optimizations.push("Ajustements extrÃªmes");
                            strategy = "Compression extrÃªme";
                            break;
                    }
                    
                    updatePreview('form');
                    showNotification(`ðŸ”§ Ajustement niveau ${attempt}: ${strategy}`, "info");
                }
                
                return {
                    isOnePage: false,
                    strategy: strategy,
                    optimizations: optimizations,
                    attempts: attempt
                };
            }
            
            async function reformulateContentUrgent(analysis) {
                console.log("ðŸš¨ Reformulation d'urgence...");
                
                // Reformulation ultra-agressive pour tenir sur une page
                const experiences = controls.experienceList.querySelectorAll('.experience-item [data-field="desc"]');
                for (let desc of experiences) {
                    if (desc.value.length > 150) {
                        const prompt = `RÃ©sume cette expÃ©rience en 1 ligne maximum, garde seulement l'essentiel: "${desc.value}"`;
                        try {
                            const ultra_short = await callGeminiAPI(prompt);
                            if (ultra_short) desc.value = ultra_short;
                        } catch (error) {
                            console.error("Erreur reformulation urgente:", error);
                        }
                    }
                }
                
                // RÃ©duction du profil aussi
                if (controls.description.value.length > 200) {
                    const prompt = `RÃ©sume ce profil en 2 lignes maximum: "${controls.description.value}"`;
                    try {
                        const short_profile = await callGeminiAPI(prompt);
                        if (short_profile) controls.description.value = short_profile;
                    } catch (error) {
                        console.error("Erreur reformulation profil urgent:", error);
                    }
                }
            }
            
            function calculateOptimalFontSizes(analysis) {
                const baseSizes = { h1: 32, h2: 18, p: 10, banner: 9 };
                
                // StratÃ©gie basÃ©e sur l'analyse intelligente
                switch (analysis.recommendedStrategy) {
                    case 'compress':
                        // StratÃ©gie de compression maximale pour contenu trÃ¨s dense
                        return { 
                            h1: 24, 
                            h2: 15, 
                            p: 8.5, 
                            banner: 8 
                        };
                    case 'balance':
                        // StratÃ©gie d'Ã©quilibre pour contenu modÃ©rÃ©
                        return { 
                            h1: 28, 
                            h2: 16.5, 
                            p: 9.5, 
                            banner: 8.5 
                        };
                    case 'expand':
                        // StratÃ©gie d'expansion pour contenu lÃ©ger
                        return { 
                            h1: 36, 
                            h2: 20, 
                            p: 11, 
                            banner: 10 
                        };
                    default:
                        // Fallback sur l'ancienne logique basÃ©e sur la densitÃ©
                        if (analysis.density > 0.8) {
                            return { h1: 26, h2: 16, p: 9, banner: 8 };
                        } else if (analysis.density > 0.6) {
                            return { h1: 28, h2: 17, p: 9.5, banner: 8.5 };
                        } else if (analysis.density > 0.4) {
                            return { h1: 30, h2: 17.5, p: 10, banner: 9 };
                        } else {
                            return { h1: 34, h2: 19, p: 10.5, banner: 9.5 };
                        }
                }
            }
            
            function calculateOptimalSpacing(analysis) {
                // StratÃ©gie basÃ©e sur l'analyse intelligente et utilisation maximale de l'espace
                switch (analysis.recommendedStrategy) {
                    case 'compress':
                        // Compression maximale - utiliser toute la largeur disponible
                        return { 
                            pageMargin: 1.2, // Marges trÃ¨s rÃ©duites pour utiliser toute la largeur
                            moduleSpacing: 0.8, 
                            paragraphSpacing: 0.25, 
                            bannerSpacing: 0.6 
                        };
                    case 'balance':
                        // Ã‰quilibre - bon compromis entre espace et lisibilitÃ©
                        return { 
                            pageMargin: 1.6, // Marges rÃ©duites mais lisibles
                            moduleSpacing: 1.2, 
                            paragraphSpacing: 0.4, 
                            bannerSpacing: 0.8 
                        };
                    case 'expand':
                        // Expansion - espacement gÃ©nÃ©reux pour un contenu aÃ©rÃ©
                        return { 
                            pageMargin: 2.2, 
                            moduleSpacing: 1.8, 
                            paragraphSpacing: 0.6, 
                            bannerSpacing: 1.2 
                        };
                    default:
                        // Fallback sur l'ancienne logique
                        if (analysis.density > 0.8) {
                            return { pageMargin: 1.3, moduleSpacing: 1, paragraphSpacing: 0.3, bannerSpacing: 0.8 };
                        } else if (analysis.density > 0.6) {
                            return { pageMargin: 1.7, moduleSpacing: 1.2, paragraphSpacing: 0.4, bannerSpacing: 0.9 };
                        } else if (analysis.density > 0.4) {
                            return { pageMargin: 2, moduleSpacing: 1.5, paragraphSpacing: 0.5, bannerSpacing: 1 };
                        } else {
                            return { pageMargin: 2.2, moduleSpacing: 1.8, paragraphSpacing: 0.6, bannerSpacing: 1.2 };
                        }
                }
            }
            
            function checkPageOverflow() {
                const pages = document.querySelectorAll('.a4-page');
                return Array.from(pages).some(page => page.scrollHeight > page.clientHeight);
            }
            
            function removeBannerBackground() {
                preview.bannerBgImg.src = '';
                controls.bannerBgImage.value = ''; // Reset file input
                controls.bannerBgOpacity.value = 1;
                controls.bannerBgBlur.value = 0;
                controls.bannerBgGrayscale.checked = false;
                updateBannerBackground();
            }

            // NEW: Progress Bar Update Function
            function updateProgressBar() {
                const checkboxes = document.querySelectorAll('.completion-checkbox');
                const total = checkboxes.length;
                const completed = document.querySelectorAll('.completion-checkbox:checked').length;
                const percentage = total > 0 ? (completed / total) * 100 : 0;

                const progressBar = document.getElementById('progress-bar');
                const progressText = document.getElementById('progress-text');

                if(progressBar) progressBar.style.width = `${percentage}%`;
                if(progressText) progressText.textContent = `${completed}/${total} sections complÃ©tÃ©es`;
            }

            function populateLevelsFromText() {
                const text = controls.competences.value;
                const skills = text
                    .replace(/.*:/g, '') // Remove category labels like "Langages:"
                    .split(/,|\n/)
                    .map(s => s.trim())
                    .filter(Boolean);

                controls.skillsLevelList.innerHTML = '';
                skills.forEach(skill => createSkillLevelItem(skill, 3));
            }

            // --- INITIALIZATION FUNCTION ---
            function initializeAll() {
                console.log("Initializing UI components and event listeners...");
                
                reinitializePreviewSelectors();
                initializeSortableForPage(1);
                
                populateFontSelectors();
                populateIconPicker();
                initializeAdvancedLayoutControls();
                initializeCollapseAllButton();
                
                // --- NOUVELLES FONCTIONS POUR REDIMENSIONNEMENT ET ZOOM ---
                initializeResizablePanels();
                initializePanelToggles();
                initializeZoomControls();

                // --- EVENT LISTENERS ---

                const tabNavigation = document.getElementById('tab-navigation');
                const tabPanels = document.querySelectorAll('.tab-panel');
                const tabButtons = document.querySelectorAll('.tab-btn');
                
                tabNavigation.addEventListener('click', (e) => {
                    const tabBtn = e.target.closest('.tab-btn');
                    if (!tabBtn) return;
                    tabPanels.forEach(panel => panel.classList.add('hidden'));
                    tabButtons.forEach(btn => {
                        btn.classList.remove('border-blue-600', 'text-blue-600');
                        btn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                    });
                    const targetPanelId = tabBtn.dataset.target;
                    document.querySelector(targetPanelId).classList.remove('hidden');
                    tabBtn.classList.add('border-blue-600', 'text-blue-600');
                    tabBtn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                });
                tabButtons[0].click();

                controls.undoBtn.addEventListener('click', undo);
                controls.redoBtn.addEventListener('click', redo);
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
                    if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
                });

                controls.addExperienceBtn.addEventListener('click', () => createDynamicItem(controls.experienceList, [{ key: 'title', placeholder: 'Titre du poste' }, { key: 'meta', placeholder: 'Entreprise & Dates' }, { key: 'desc', placeholder: 'Description des missions', type: 'textarea' }]));
                controls.addFormationBtn.addEventListener('click', () => createDynamicItem(controls.formationList, [{ key: 'title', placeholder: 'Nom du diplÃ´me' }, { key: 'meta', placeholder: 'Ã‰tablissement & AnnÃ©e' }]));
                
                const controlsPanel = document.getElementById('controls');
                controlsPanel.addEventListener('input', (e) => {
                    if (e.target.matches('.cv-input, .banner-input, .custom-section-input, #banner-bg-opacity, #banner-bg-blur, #banner-bg-grayscale')) {
                        if (e.target.matches('#banner-bg-opacity, #banner-bg-blur, #banner-bg-grayscale')) {
                             updateBannerBackground();
                        } else {
                             updatePreview('form');
                             updateAllStyles();
                        }
                    }
                    if(e.target.matches('.completion-checkbox')) {
                        updateProgressBar();
                    }
                     if(e.target.matches('.skill-level-input')) {
                         e.target.nextElementSibling.textContent = `${e.target.value}/5`;
                         updatePreview('form');
                     }
                });
                 controlsPanel.addEventListener('change', (e) => {
                    if (e.target.matches('.cv-input, .banner-input, .custom-section-input')) {
                        updatePreview('form');
                        updateAllStyles();
                    }
                });

                controls.bannerImage.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => { preview.bannerImg.src = event.target.result; };
                        reader.readAsDataURL(file);
                    }
                });
                
                controls.bannerBgImage.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            preview.bannerBgImg.src = event.target.result;
                            updateBannerBackground();
                        };
                        reader.readAsDataURL(file);
                    }
                });
                
                // Gestionnaire spÃ©cifique pour la checkbox de la banniÃ¨re
                if (controls.toggleBanner) {
                    controls.toggleBanner.addEventListener('change', () => {
                        console.log('Banner toggle changed:', controls.toggleBanner.checked);
                        updatePreview('form');
                        updateAllStyles();
                    });
                }

                preview.previewWrapper.addEventListener('input', (e) => {
                    if (e.target.hasAttribute('contenteditable')) {
                        syncFormFromPreview(e.target);
                    }
                });

                preview.previewWrapper.addEventListener('click', (e) => {
                    const target = e.target;
                    
                    const visibilityBtn = target.closest('.toggle-visibility-btn');
                    if (visibilityBtn) {
                        const moduleElement = visibilityBtn.closest('.cv-module');
                        const icon = visibilityBtn.querySelector('i');
                        if (moduleElement) {
                            moduleElement.classList.toggle('section-hidden');
                            const isHidden = moduleElement.classList.contains('section-hidden');
                            if (icon) {
                                icon.className = `fas ${isHidden ? 'fa-eye-slash' : 'fa-eye'}`;
                            }
                        }
                        return;
                    }

                    const aiBtn = target.closest('.ai-action-btn');
                    if (aiBtn) {
                        const action = aiBtn.dataset.action;
                        if (action) {
                            handleAIAction(action);
                        }
                        return;
                    }

                    const deleteBlockBtn = target.closest('.delete-block-btn');
                    if (deleteBlockBtn) {
                        const itemContainer = deleteBlockBtn.closest('.dynamic-item-container');
                        if (itemContainer) {
                            const index = parseInt(itemContainer.dataset.index, 10);
                            const type = itemContainer.dataset.type;
                            const formList = type === 'experience' ? controls.experienceList : controls.formationList;
                            if (formList.children[index]) {
                                formList.children[index].remove();
                                updatePreview('form');
                            }
                        } else {
                            const customModule = deleteBlockBtn.closest('.custom-module-preview');
                            if(customModule) {
                                const controlItem = controls.customSectionsList.querySelector(`[data-section-id="${customModule.id}"]`);
                                if(controlItem) controlItem.remove();
                                customModule.remove();
                            }
                        }
                        return;
                    }

                    const addLineBtn = target.closest('.add-line-preview-btn');
                    if (addLineBtn) {
                        const index = parseInt(addLineBtn.dataset.index, 10);
                        const type = addLineBtn.dataset.type;
                        if (type === 'experience') createDynamicItem(controls.experienceList, [{ key: 'title', placeholder: 'Titre du poste' }, { key: 'meta', placeholder: 'Entreprise & Dates' }, { key: 'desc', placeholder: 'Description des missions', type: 'textarea' }], {}, index);
                        else if (type === 'formation') createDynamicItem(controls.formationList, [{ key: 'title', placeholder: 'Nom du diplÃ´me' }, { key: 'meta', placeholder: 'Ã‰tablissement & AnnÃ©e' }], {}, index);
                        return;
                    }

                    const deleteLineBtn = target.closest('.delete-line-btn');
                    if (deleteLineBtn) {
                        const wrapper = deleteLineBtn.closest('.editable-wrapper');
                        if (wrapper) {
                            wrapper.remove();
                            syncFormFromPreview(wrapper.closest('.dynamic-preview-item') || document.getElementById('cv-description-preview'));
                        }
                        return;
                    }
                    
                    const removePageBtn = target.closest('.remove-page-btn');
                    if (removePageBtn) {
                        const pageContainer = removePageBtn.closest('.a4-page-container');
                        if (pageContainer) {
                            pageContainer.remove();
                            checkAllPagesOverflow();
                        }
                        return;
                    }
                });

                controlsPanel.addEventListener('click', (e) => {
                    const target = e.target;
                    
                    const removeBtn = target.closest('.remove-dynamic-item-btn, .remove-skill-level-btn');
                    if (removeBtn) {
                        removeBtn.parentElement.remove();
                        updatePreview('form');
                        return;
                    }
                    const removeSectionBtn = target.closest('.remove-section-btn');
                    if (removeSectionBtn) {
                        const sectionDiv = removeSectionBtn.closest('[data-section-id]');
                        const sectionId = sectionDiv.dataset.sectionId;
                        sectionDiv.remove();
                        const previewModule = document.getElementById(sectionId);
                        if(previewModule) previewModule.remove();
                        return;
                    }
                    
                    const layoutBtn = target.closest('.layout-btn');
                    if (layoutBtn) {
                        const layout = layoutBtn.dataset.layout;
                        document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
                        layoutBtn.classList.add('active');
                        document.querySelectorAll('.cv-body-container').forEach(container => {
                           container.className = `cv-body-container ${layout}`;
                           if (layout === 'layout-1-col') {
                               const col2 = container.querySelector('.cv-column:nth-child(2)');
                               const col1 = container.querySelector('.cv-column:nth-child(1)');
                               if (col2 && col1) Array.from(col2.children).forEach(module => col1.appendChild(module));
                           }
                           container.style.gridTemplateColumns = '';
                        });
                        setupAllResizers();
                        checkAllPagesOverflow();
                        return;
                    }

                    const titleStyleBtn = target.closest('.section-title-style-btn');
                    if (titleStyleBtn) {
                        document.querySelectorAll('.section-title-style-btn').forEach(b => b.classList.remove('active'));
                        titleStyleBtn.classList.add('active');
                        updateAllStyles();
                        return;
                    }
                    
                    const themeBtn = target.closest('.theme-btn');
                    if (themeBtn) {
                        applyTheme(themeBtn.dataset.theme);
                        return;
                    }

                    const logoSizeBtn = target.closest('.logo-size-btn');
                    if (logoSizeBtn) {
                        document.querySelectorAll('.logo-size-btn').forEach(b => b.classList.remove('active'));
                        logoSizeBtn.classList.add('active');
                        preview.bannerImg.className = `logo-${logoSizeBtn.dataset.logoSize}`;
                        return;
                    }

                    const skillStyleBtn = target.closest('.skill-style-btn');
                    if (skillStyleBtn) {
                        document.querySelectorAll('.skill-style-btn').forEach(b => b.classList.remove('active'));
                        skillStyleBtn.classList.add('active');
                        const style = skillStyleBtn.dataset.skillStyle;
                        controls.skillsTextControls.classList.toggle('hidden', style === 'levels');
                        controls.skillsLevelControls.classList.toggle('hidden', style !== 'levels');
                        if (style === 'levels') {
                            populateLevelsFromText();
                        }
                        updatePreview('form');
                        return;
                    }
                    
                    const gaugeStyleBtn = target.closest('.gauge-style-btn');
                    if (gaugeStyleBtn) {
                        document.querySelectorAll('.gauge-style-btn').forEach(b => b.classList.remove('active'));
                        gaugeStyleBtn.classList.add('active');
                        updatePreview('form');
                        return;
                    }

                    const styleToggleBtn = target.closest('.style-toggle-btn');
                    if (styleToggleBtn) {
                        styleToggleBtn.classList.toggle('active');
                        updatePreview('form');
                        return;
                    }
                });

                Object.values(sliders).forEach(config => {
                    config.el.addEventListener('input', () => {
                        config.valueEl.textContent = config.el.value;
                        root.style.setProperty(config.property, `${config.el.value}${config.unit}`);
                        checkAllPagesOverflow();
                    });
                });

                // Gestionnaire pour le bouton couleur IA
                const aiColorBtn = document.getElementById('ai-color-btn');
                if (aiColorBtn) {
                    aiColorBtn.addEventListener('click', async () => {
                        if (!isApiConfigured()) {
                            showNotification("Veuillez configurer votre clÃ© API Gemini d'abord.", "error");
                            return;
                        }
                        
                        await generateAIColors();
                    });
                }
                
                controls.analyzeBtn.addEventListener('click', async () => {
                    const text = controls.aiInput.value;
                    if (!text) { showNotification("Veuillez coller du texte Ã  analyser.", "error"); return; }
                    
                    // VÃ©rifier la clÃ© API avant de continuer
                    if (!validateApiKey()) {
                        showNotification("Veuillez configurer votre clÃ© API Gemini d'abord.", "error");
                        return;
                    }
                    
                    // Afficher le loader pendant l'analyse
                    showLoader("ðŸ¤– Analyse IA en cours...");
                    
                    // DÃ©sactiver le bouton pendant le traitement
                    controls.analyzeBtn.disabled = true;
                    controls.analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');
                    
                    try {
                        // Lancer l'animation spectaculaire
                        const animationPromise = showCVRestructureAnimation();
                        
                        const schema = {
                            type: "OBJECT",
                            properties: {
                                nom: { type: "STRING" }, prenom: { type: "STRING" }, poste: { type: "STRING" }, description: { type: "STRING" },
                                experiences: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, meta: { type: "STRING" }, desc: { type: "STRING" } } } },
                                formations: { type: "ARRAY", items: { type: "OBJECT", properties: { title: { type: "STRING" }, meta: { type: "STRING" } } } },
                                competences: { type: "STRING" }
                            }
                        };
                        const prompt = `Tu es un expert en analyse de CV. Analyse le texte suivant et extrais EXACTEMENT les informations personnelles et professionnelles.

RÃˆGLES STRICTES :
1. RÃ©ponds UNIQUEMENT avec un JSON valide
2. Pas de commentaires, pas de texte avant ou aprÃ¨s le JSON
3. Utilise des guillemets doubles pour toutes les chaÃ®nes
4. Ã‰chappe correctement les guillemets dans le contenu
5. Si une information n'est pas trouvÃ©e, mets une chaÃ®ne vide ""
6. Assure-toi que le JSON est complet et valide

FORMAT EXACT :
{
  "nom": "NOM_DE_FAMILLE",
  "prenom": "PrÃ©nom", 
  "poste": "Titre du poste recherchÃ©",
  "description": "RÃ©sumÃ© professionnel court",
  "experiences": [{"title": "Titre", "meta": "Entreprise â€¢ Dates", "desc": "Description"}],
  "formations": [{"title": "DiplÃ´me", "meta": "Ã‰cole â€¢ AnnÃ©e"}],
  "competences": "CompÃ©tence1, CompÃ©tence2, CompÃ©tence3"
}

TEXTE Ã€ ANALYSER :
${text}

JSON :`;
                        
                        // Mettre Ã  jour le texte du loader pendant l'appel API
                        controls.loaderText.textContent = "ðŸ§  Traitement par l'IA...";
                        
                        console.log("=== DÃ‰BUT ANALYSE IA ===");
                        console.log("Texte Ã  analyser:", text);
                        console.log("Prompt envoyÃ©:", prompt);
                        
                        const extractedData = await callGeminiAPI(prompt, schema);
                        
                        console.log("=== RÃ‰SULTAT IA ===");
                        console.log("DonnÃ©es extraites par l'IA:", extractedData);
                        console.log("Type des donnÃ©es:", typeof extractedData);
                        console.log("L'IA a-t-elle retournÃ© des donnÃ©es?", !!extractedData);
                        
                        if (extractedData && extractedData.nom) {
                            console.log("âœ… IA a rÃ©ussi - utilisation des vraies donnÃ©es");
                        } else {
                            console.log("âŒ IA a Ã©chouÃ© - utilisation de fallback");
                        }
                        
                        if (extractedData) {
                            // Mettre Ã  jour le texte du loader
                            controls.loaderText.textContent = "âœ¨ Remplissage du CV...";
                            
                            // Debug : VÃ©rifier que les contrÃ´les existent
                            console.log("=== VÃ‰RIFICATION DES CONTRÃ”LES ===");
                            console.log("controls.nom:", controls.nom, "existe?", !!controls.nom);
                            console.log("controls.prenom:", controls.prenom, "existe?", !!controls.prenom);
                            console.log("controls.poste:", controls.poste, "existe?", !!controls.poste);
                            console.log("controls.description:", controls.description, "existe?", !!controls.description);
                            console.log("controls.competences:", controls.competences, "existe?", !!controls.competences);
                            
                            // VÃ©rifier aussi avec getElementById direct
                            console.log("=== VÃ‰RIFICATION DIRECTE DU DOM ===");
                            console.log("document.getElementById('nom'):", document.getElementById('nom'));
                            console.log("document.getElementById('prenom'):", document.getElementById('prenom'));
                            console.log("document.getElementById('poste'):", document.getElementById('poste'));
                            
                            console.log("Valeurs Ã  insÃ©rer:", {
                                nom: extractedData.nom,
                                prenom: extractedData.prenom,
                                poste: extractedData.poste,
                                description: extractedData.description
                            });
                            
                            // Attendre que l'animation soit bien avancÃ©e avant de remplir
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            
                            // Remplir avec l'effet Matrix d'Ã©criture en temps rÃ©el
                            const elementsToFill = [
                                { element: controls.nom, text: extractedData.nom || '' },
                                { element: controls.prenom, text: extractedData.prenom || '' },
                                { element: controls.poste, text: extractedData.poste || '' },
                                { element: controls.description, text: extractedData.description || '' },
                                { element: controls.competences, text: extractedData.competences || '' }
                            ];
                            
                            console.log("Elements Ã  remplir:", elementsToFill);
                            
                            // TEST: Remplissage direct sans animation pour dÃ©boguer
                            console.log("=== REMPLISSAGE DIRECT (TEST) ===");
                            if (controls.nom && extractedData.nom) {
                                controls.nom.value = extractedData.nom;
                                console.log(`Nom rempli: ${controls.nom.value}`);
                            }
                            if (controls.prenom && extractedData.prenom) {
                                controls.prenom.value = extractedData.prenom;
                                console.log(`PrÃ©nom rempli: ${controls.prenom.value}`);
                            }
                            if (controls.poste && extractedData.poste) {
                                controls.poste.value = extractedData.poste;
                                console.log(`Poste rempli: ${controls.poste.value}`);
                            }
                            if (controls.description && extractedData.description) {
                                controls.description.value = extractedData.description;
                                console.log(`Description remplie: ${controls.description.value}`);
                            }
                            if (controls.competences && extractedData.competences) {
                                controls.competences.value = extractedData.competences;
                                console.log(`CompÃ©tences remplies: ${controls.competences.value}`);
                            }
                            
                            // Remplir les expÃ©riences et formations
                            console.log("=== REMPLISSAGE LISTES ===");
                            controls.experienceList.innerHTML = '';
                            (extractedData.experiences || []).forEach((exp, index) => {
                                console.log(`Ajout expÃ©rience ${index}:`, exp);
                                createDynamicItem(controls.experienceList, [
                                    { key: 'title', placeholder: 'Titre du poste' }, 
                                    { key: 'meta', placeholder: 'Entreprise & Dates' }, 
                                    { key: 'desc', placeholder: 'Description', type: 'textarea' }
                                ], exp);
                            });
                            
                            controls.formationList.innerHTML = '';
                            (extractedData.formations || []).forEach((form, index) => {
                                console.log(`Ajout formation ${index}:`, form);
                                createDynamicItem(controls.formationList, [
                                    { key: 'title', placeholder: 'Nom du diplÃ´me' }, 
                                    { key: 'meta', placeholder: 'Ã‰tablissement & AnnÃ©e' }
                                ], form);
                            });
                            
                            // Mettre Ã  jour l'aperÃ§u immÃ©diatement
                            console.log("=== MISE Ã€ JOUR APERÃ‡U ===");
                            updatePreview('form');
                            
                            // Finaliser
                            animationPromise.then(() => {
                                hideLoader();
                                showNotification("âœ¨ CV rempli avec succÃ¨s !", "success");
                                controls.analyzeBtn.disabled = false;
                                controls.analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                            });
                            
                            return; // Skip Matrix animation for now
                            
                            // Ã‰crire les champs principaux avec effet Matrix
                            let currentFieldIndex = 0;
                            function fillNextField() {
                                if (currentFieldIndex >= elementsToFill.length) {
                                    // Remplir les listes aprÃ¨s les champs principaux
                                    controls.experienceList.innerHTML = '';
                                    (testData.experiences || []).forEach(exp => createDynamicItem(controls.experienceList, [{ key: 'title', placeholder: 'Titre du poste' }, { key: 'meta', placeholder: 'Entreprise & Dates' }, { key: 'desc', placeholder: 'Description', type: 'textarea' }], exp));
                                    
                                    controls.formationList.innerHTML = '';
                                    (testData.formations || []).forEach(form => createDynamicItem(controls.formationList, [{ key: 'title', placeholder: 'Nom du diplÃ´me' }, { key: 'meta', placeholder: 'Ã‰tablissement & AnnÃ©e' }], form));
                                    
                                    // Attendre la fin de l'animation avant de finaliser
                                    animationPromise.then(() => {
                                        updatePreview('form');
                                        hideLoader(); // Masquer le loader
                                        showNotification("âœ¨ CV restructurÃ© et rempli par la Matrix !", "success");
                                        
                                        // RÃ©activer le bouton
                                        controls.analyzeBtn.disabled = false;
                                        controls.analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                                    });
                                    return;
                                }
                                
                                const currentField = elementsToFill[currentFieldIndex];
                                if (currentField.text) {
                                    writeTextMatrixStyle(currentField.element, currentField.text, () => {
                                        currentFieldIndex++;
                                        setTimeout(fillNextField, 300);
                                    });
                                } else {
                                    currentFieldIndex++;
                                    fillNextField();
                                }
                            }
                            
                            fillNextField();
                        } else {
                            // En cas d'erreur, masquer l'animation et le loader
                            hideCVRestructureAnimation();
                            hideLoader();
                            showNotification("âŒ Aucune donnÃ©e extraite. L'IA n'a pas pu analyser le texte.", "error");
                            
                            // RÃ©activer le bouton
                            controls.analyzeBtn.disabled = false;
                            controls.analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                        }
                    } catch (error) {
                        console.error("Erreur lors de l'analyse IA:", error);
                        hideLoader();
                        hideCVRestructureAnimation();
                        
                        // Message d'erreur plus spÃ©cifique selon le type d'erreur
                        let errorMessage = "âŒ Erreur lors de l'analyse.";
                        if (error.message.includes("API")) {
                            errorMessage = "âŒ Erreur API. VÃ©rifiez votre clÃ© Gemini.";
                        } else if (error.message.includes("JSON")) {
                            errorMessage = "âŒ Erreur de format. L'IA n'a pas rÃ©pondu correctement.";
                        } else if (error.message.includes("rÃ©seau") || error.message.includes("connexion")) {
                            errorMessage = "âŒ Erreur de connexion. VÃ©rifiez votre internet.";
                        } else {
                            errorMessage = `âŒ Erreur: ${error.message}`;
                        }
                        
                        showNotification(errorMessage, "error", 8000);
                        
                        // RÃ©activer le bouton
                        controls.analyzeBtn.disabled = false;
                        controls.analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    }
                });
                
                // BOUTON DE TEST TEMPORAIRE
                const testFillBtn = document.getElementById('test-fill-btn');
                if (testFillBtn) {
                    testFillBtn.addEventListener('click', () => {
                        console.log("Test de remplissage manuel...");
                        
                        // Test direct des champs
                        if (controls.nom) {
                            controls.nom.value = "MARTIN";
                            console.log("Nom mis Ã  jour:", controls.nom.value);
                        }
                        if (controls.prenom) {
                            controls.prenom.value = "Jean";
                            console.log("PrÃ©nom mis Ã  jour:", controls.prenom.value);
                        }
                        if (controls.poste) {
                            controls.poste.value = "DÃ©veloppeur Web";
                            console.log("Poste mis Ã  jour:", controls.poste.value);
                        }
                        if (controls.description) {
                            controls.description.value = "DÃ©veloppeur passionnÃ© avec 5 ans d'expÃ©rience.";
                            console.log("Description mise Ã  jour:", controls.description.value);
                        }
                        
                        // Mettre Ã  jour l'aperÃ§u
                        updatePreview('form');
                        showNotification("âœ… Test de remplissage effectuÃ© !", "success");
                    });
                }
                
                // BOUTON DE TEST API
                const testApiBtn = document.getElementById('test-api-btn');
                if (testApiBtn) {
                    testApiBtn.addEventListener('click', async () => {
                        console.log("=== TEST API GEMINI ===");
                        
                        const testPrompt = `RÃ©ponds par un JSON simple avec juste: {"test": "ok", "message": "API fonctionne"}`;
                        const testSchema = {
                            type: "OBJECT",
                            properties: {
                                test: { type: "STRING" },
                                message: { type: "STRING" }
                            }
                        };
                        
                        try {
                            showLoader("ðŸ§ª Test de l'API...");
                            const result = await callAI(testPrompt, testSchema);
                            hideLoader();
                            
                            if (result && result.test === "ok") {
                                showNotification("âœ… API Gemini fonctionne parfaitement !", "success");
                                console.log("âœ… Test API rÃ©ussi:", result);
                            } else {
                                showNotification("âš ï¸ API rÃ©pond mais donnÃ©es incohÃ©rentes", "warning");
                                console.log("âš ï¸ RÃ©sultat inattendu:", result);
                            }
                        } catch (error) {
                            hideLoader();
                            showNotification("âŒ Test API Ã©chouÃ©: " + error.message, "error");
                            console.error("âŒ Test API Ã©chouÃ©:", error);
                        }
                    });
                }
                
                controls.generateMailBtn.addEventListener('click', async () => {
                    const nomCandidat = `${controls.prenom.value} ${controls.nom.value}`.trim();
                    const posteCandidat = controls.poste.value;
                    const dispoCandidat = controls.qualificationDispo.value;
                    const salaireCandidat = controls.qualificationSalaire.value;
                    const profilCandidat = controls.description.value;
                    const nomRecruteur = controls.bannerNom.value || "votre consultant";
                    const posteRecruteur = controls.bannerPoste.value || "cabinet de recrutement";

                    if (!nomCandidat || !posteCandidat) {
                        showNotification("Veuillez renseigner au moins le nom, prÃ©nom et poste du candidat.", "error");
                        return;
                    }

                    const prompt = `En tant que consultant en recrutement pour un cabinet, rÃ©dige un e-mail de vente percutant destinÃ© Ã  un client pour lui prÃ©senter un excellent candidat.
                    
                    **Ton Persona:** Tu es ${nomRecruteur}, ${posteRecruteur}. Tu es proactif, professionnel et tu connais bien ton marchÃ©.
                    **Objectif:** Convaincre le client de l'adÃ©quation du profil avec ses besoins potentiels et l'inciter Ã  en savoir plus.
                    
                    **Informations sur le candidat Ã  intÃ©grer:**
                    - Nom du candidat: ${nomCandidat}
                    - Poste ciblÃ©: ${posteCandidat}
                    - DisponibilitÃ©: ${dispoCandidat || 'Ã  discuter'}
                    - PrÃ©tentions salariales: ${salaireCandidat || 'Ã  discuter'}
                    - RÃ©sumÃ© du profil: "${profilCandidat}"

                    **Structure de l'e-mail:**
                    1.  **Objet accrocheur:** Ex: "Profil - [Poste du candidat]" ou "OpportunitÃ©: Un [Poste du candidat] pour vos Ã©quipes".
                    2.  **Introduction:** Commence par une formule de politesse professionnelle (ex: "Bonjour,"). Mentionne que tu le contactes pour lui prÃ©senter un profil qui pourrait l'intÃ©resser.
                    3.  **PrÃ©sentation du profil:** Met en avant les points forts du candidat en te basant sur son rÃ©sumÃ©. Sois concis et impactant. Mentionne le poste, et Ã©ventuellement une ou deux compÃ©tences clÃ©s si elles sont Ã©videntes.
                    4.  **Informations pratiques:** Indique sa disponibilitÃ© et ses prÃ©tentions salariales de maniÃ¨re professionnelle.
                    5.  **Call to action:** Propose d'envoyer le CV complet et/ou de planifier un bref appel pour discuter plus en dÃ©tail du profil.
                    6.  **Conclusion:** Termine par une formule de politesse et ta signature (${nomRecruteur}).

                    **Important:** Ne retourne QUE le texte de l'e-mail (objet inclus, sous la forme "Objet: ..."), sans aucune phrase d'introduction ou de conclusion de ta part. Le ton doit Ãªtre celui d'un partenaire commercial, pas celui du candidat.`;

                    const mailContent = await callGeminiAPI(prompt);
                    if (mailContent) {
                        // Ã‰crire l'email avec l'effet Matrix
                        writeTextMatrixStyle(controls.recruiterMailContent, mailContent, () => {
                            showNotification("E-mail de prÃ©sentation client gÃ©nÃ©rÃ© par la Matrix.", "success");
                        });
                    }
                });

                controls.downloadPdfBtn.addEventListener('click', async () => {
                    const filename = `CV_${controls.prenom.value}_${controls.nom.value}.pdf`.replace(/ /g, '_');
                    document.body.classList.add('presentation-mode');

                    const bannerImg = preview.bannerImg;
                    const bannerBg = preview.bannerBgImg;
                    const originalBannerImg = { src: bannerImg.src, style: bannerImg.style.cssText };
                    const originalBannerBg = { src: bannerBg.src, style: bannerBg.style.cssText };

                    const processImage = async (imgElement, isCircle = false) => {
                        if (!imgElement.src || imgElement.src.startsWith('https://placehold.co')) return;

                        const img = new Image();
                        img.crossOrigin = "anonymous";
                        
                        const promise = new Promise((resolve) => {
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const size = Math.min(img.naturalWidth, img.naturalHeight);
                                canvas.width = isCircle ? size : img.naturalWidth;
                                canvas.height = isCircle ? size : img.naturalHeight;

                                if (isCircle) {
                                    ctx.beginPath();
                                    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                                    ctx.clip();
                                }
                                
                                const hRatio = canvas.width / img.naturalWidth;
                                const vRatio = canvas.height / img.naturalHeight;
                                const ratio = Math.max(hRatio, vRatio);
                                const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
                                const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;
                                
                                const opacity = imgElement.style.opacity || '1';
                                const filter = imgElement.style.filter || 'none';
                                ctx.globalAlpha = parseFloat(opacity);
                                ctx.filter = filter;
                                
                                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio);

                                imgElement.src = canvas.toDataURL('image/png');
                                imgElement.style.borderRadius = '0';
                                imgElement.style.objectFit = 'contain';
                                imgElement.style.filter = 'none';
                                imgElement.style.opacity = '1';
                                resolve();
                            };
                            img.onerror = () => {
                                console.error("Could not load image for PDF processing:", imgElement.src);
                                resolve(); // Resolve anyway to not block PDF generation
                            };
                        });
                        img.src = imgElement.src;
                        return promise;
                    };
                    
                    await processImage(bannerImg, true);
                    await processImage(bannerBg, false);

                    const opt = {
                        margin: 0,
                        filename: filename,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, logging: false },
                        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
                    };

                    html2pdf().from(preview.previewWrapper).set(opt).save().finally(() => {
                        bannerImg.src = originalBannerImg.src;
                        bannerImg.style.cssText = originalBannerImg.style;
                        bannerBg.src = originalBannerBg.src;
                        bannerBg.style.cssText = originalBannerBg.style;
                        document.body.classList.remove('presentation-mode');
                    });
                });

                controls.resetCvBtn.addEventListener('click', async () => {
                    const confirmed = await showConfirmModal("Nouveau CV", "ÃŠtes-vous sÃ»r de vouloir rÃ©initialiser complÃ¨tement le CV ?");
                    if (confirmed) resetCVToDefault();
                });
                
                controls.togglePresentationModeBtn.addEventListener('click', () => {
                    document.body.classList.toggle('presentation-mode');
                    const isActive = document.body.classList.contains('presentation-mode');
                    controls.togglePresentationModeBtn.innerHTML = `<i class="fa-solid ${isActive ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isActive ? 'Quitter PrÃ©sentation' : 'Mode PrÃ©sentation'}`;
                });
                
                controls.toggleOverflowBtn.addEventListener('click', (e) => {
                    document.body.classList.toggle('overflow-check-active');
                    e.currentTarget.classList.toggle('active');
                    
                    const isActive = document.body.classList.contains('overflow-check-active');
                    
                    if (isActive) {
                        showNotification('Mode dÃ©tection de dÃ©passement activÃ©', 'info', 3000);
                        e.currentTarget.style.backgroundColor = '#ef4444';
                        e.currentTarget.style.color = 'white';
                    } else {
                        showNotification('Mode dÃ©tection de dÃ©passement dÃ©sactivÃ©', 'info', 3000);
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '';
                    }
                    
                    checkAllPagesOverflow();
                });

                // Gestionnaire pour le bouton partager
                controls.shareBtn.addEventListener('click', () => {
                    openShareModal();
                });

                // Gestionnaires pour le modal de partage
                controls.closeShareModal.addEventListener('click', () => {
                    controls.shareModal.classList.remove('active');
                });

                controls.copyShareLinkBtn.addEventListener('click', () => {
                    copyShareLink();
                });

                // Fermer le modal en cliquant Ã  l'extÃ©rieur
                controls.shareModal.addEventListener('click', (e) => {
                    if (e.target === controls.shareModal) {
                        controls.shareModal.classList.remove('active');
                    }
                });

                controls.aiSummarizeBtn.addEventListener('click', summarizeAllExperiencesAI);
                
                // Nouveaux gestionnaires IA
                if (controls.aiLayoutOptimizeBtn) {
                    controls.aiLayoutOptimizeBtn.addEventListener('click', aiLayoutOptimization);
                }
                
                if (controls.aiOptimizeAllBtn) {
                    controls.aiOptimizeAllBtn.addEventListener('click', optimizeAllCV);
                }
                
                if (controls.aiRewriteDescriptionsBtn) {
                    controls.aiRewriteDescriptionsBtn.addEventListener('click', rewriteDescriptions);
                }
                
                if (controls.aiGenerateAchievementsBtn) {
                    controls.aiGenerateAchievementsBtn.addEventListener('click', generateAchievements);
                }
                
                if (controls.aiSuggestSkillsBtn) {
                    controls.aiSuggestSkillsBtn.addEventListener('click', suggestSkills);
                }
                
                if (controls.aiImproveProfileBtn) {
                    controls.aiImproveProfileBtn.addEventListener('click', improveProfile);
                }
                
                if (controls.aiAdaptSectorBtn) {
                    controls.aiAdaptSectorBtn.addEventListener('click', adaptToSector);
                }
                
                if (controls.aiKeywordsBoostBtn) {
                    controls.aiKeywordsBoostBtn.addEventListener('click', boostKeywords);
                }
                    controls.aiSynthesizeSkillsBtn.addEventListener('click', synthesizeSkillsWithAI);
                    controls.aiLimitSkillsBtn.addEventListener('click', limitSkillsWithAI);
                    controls.anonymizeBtn.addEventListener('click', anonymizeCV);
                    controls.resetRecruiterBtn.addEventListener('click', () => { setDefaultRecruiterInfo(); updatePreview('form'); });
    
                async function limitSkillsWithAI() {
                    try {
                        const limitedSkills = await callGeminiAPI(prompt);
                        if (limitedSkills) {
                            // ...existing code...
                        }
                    } catch (error) {
                        console.error('Erreur lors de la limitation des compÃ©tences:', error);
                        showNotification("Erreur lors de la limitation des compÃ©tences avec l'IA", "error");
                    }
                }
                
                // Event listeners pour les nouveaux boutons de sauvegarde/chargement
                controls.saveBannerPresetBtn.addEventListener('click', saveBannerPreset);
                controls.loadBannerPresetBtn.addEventListener('click', loadBannerPreset);
                controls.saveRecruiterInfoBtn.addEventListener('click', saveRecruiterInfo);
                controls.loadRecruiterInfoBtn.addEventListener('click', loadRecruiterInfo);
                controls.addPageBtn.addEventListener('click', () => addNewPage());
                controls.removeBannerBgBtn.addEventListener('click', () => removeBannerBackground());
                controls.addSectionBtn.addEventListener('click', () => {
                    const title = controls.newSectionTitleInput.value.trim();
                    if(title) {
                        addCustomSection(title);
                        controls.newSectionTitleInput.value = '';
                    } else {
                        showNotification("Veuillez entrer un titre pour la nouvelle section.", "error");
                    }
                });
                controls.sectionSuggestionSelect.addEventListener('change', (e) => {
                    if(e.target.value) controls.newSectionTitleInput.value = e.target.value;
                });
                controls.fixBannerTopBtn.addEventListener('click', () => moveBannerTo('top'));
                controls.fixBannerBottomBtn.addEventListener('click', () => moveBannerTo('bottom'));
                controls.modularBannerBtn.addEventListener('click', () => moveBannerTo('modular'));
                controls.addSkillLevelBtn.addEventListener('click', () => createSkillLevelItem());

                // Nouveaux event listeners pour la barre d'outils
                controls.toolbarSaveBtn.addEventListener('click', () => {
                    saveCV();
                    showNotification("CV sauvegardÃ© localement avec succÃ¨s.", "success");
                });

                controls.toolbarLoadBtn.addEventListener('click', () => {
                    if (loadCV()) {
                        showNotification("CV chargÃ© depuis la sauvegarde locale.", "success");
                    } else {
                        showNotification("Aucune sauvegarde trouvÃ©e.", "error");
                    }
                });

                controls.geminiApiKey.addEventListener('input', (e) => {
                    if (e.target.value.trim()) {
                        apiKeys.gemini = e.target.value.trim();
                        localStorage.setItem('gemini-api-key', e.target.value.trim());
                        updateApiStatus();
                    }
                });
                
                // --- GESTIONNAIRES D'Ã‰VÃ‰NEMENTS POUR LES API ---
                
                // Chargement des paramÃ¨tres API au dÃ©marrage
                initializeApiSettings();
                
                // Sauvegarder automatiquement les clÃ©s pendant la frappe
                if (controls.geminiApiKey) {
                    controls.geminiApiKey.addEventListener('input', (e) => {
                        if (e.target.value.trim()) {
                            apiKeys.gemini = e.target.value.trim();
                            localStorage.setItem('gemini-api-key', e.target.value.trim());
                            updateApiStatus();
                        }
                    });
                }
                
                if (controls.chatgptApiKey) {
                    controls.chatgptApiKey.addEventListener('input', (e) => {
                        if (e.target.value.trim()) {
                            apiKeys.chatgpt = e.target.value.trim();
                            localStorage.setItem('chatgpt-api-key', e.target.value.trim());
                            updateApiStatus();
                        }
                    });
                }
                
                // Boutons de sÃ©lection d'API
                if (controls.selectGeminiBtn) {
                    controls.selectGeminiBtn.addEventListener('click', () => {
                        switchApiProvider('gemini');
                    });
                }
                
                if (controls.selectChatgptBtn) {
                    controls.selectChatgptBtn.addEventListener('click', () => {
                        switchApiProvider('chatgpt');
                    });
                }
                
                // Bouton de basculement
                if (controls.switchApiBtn) {
                    controls.switchApiBtn.addEventListener('click', () => {
                        switchApiProvider();
                    });
                }
                
                // Boutons de sauvegarde des clÃ©s
                if (controls.saveGeminiKeyBtn) {
                    controls.saveGeminiKeyBtn.addEventListener('click', async () => {
                        saveApiKey('gemini');
                    });
                }
                
                if (controls.saveChatgptKeyBtn) {
                    controls.saveChatgptKeyBtn.addEventListener('click', async () => {
                        saveApiKey('chatgpt');
                    });
                }
                
                // CompatibilitÃ© avec l'ancien bouton (redirige vers le bon gestionnaire)
                if (controls.saveApiKeyBtn) {
                    controls.saveApiKeyBtn.addEventListener('click', async () => {
                        saveApiKey(currentApiProvider);
                    });
                }

                // Tentative de chargement automatique au dÃ©marrage
                if (localStorage.getItem('cv-data')) {
                    setTimeout(() => {
                        if (loadCV()) {
                            showNotification("CV restaurÃ© depuis la sauvegarde locale.", "info");
                        }
                    }, 1000);
                }

                // Chargement automatique des informations recruteur si disponibles
                setTimeout(() => {
                    if (localStorage.getItem('recruiter-info')) {
                        // Ne charge que si les champs sont vides (pour Ã©viter d'Ã©craser les donnÃ©es chargÃ©es du CV)
                        if (!controls.bannerNom.value && !controls.bannerPoste.value && !controls.bannerEmail.value && !controls.bannerTel.value) {
                            loadRecruiterInfo();
                        }
                    }
                }, 1200);

                // Fonction pour positionner intelligemment les tooltips
                function positionTooltip(tooltip) {
                    const tooltipContent = tooltip.querySelector('.tooltip-content');
                    if (!tooltipContent) return;

                    const rect = tooltip.getBoundingClientRect();
                    const contentRect = tooltipContent.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    // Reset classes
                    tooltipContent.classList.remove('top', 'bottom', 'left', 'right');

                    // Choisir la position optimale
                    if (rect.top > contentRect.height + 20) {
                        tooltipContent.classList.add('top');
                    } else if (rect.bottom + contentRect.height + 20 < viewportHeight) {
                        tooltipContent.classList.add('bottom');
                    } else if (rect.right + contentRect.width + 20 < viewportWidth) {
                        tooltipContent.classList.add('right');
                    } else {
                        tooltipContent.classList.add('left');
                    }
                }

                // Appliquer le positionnement intelligent des tooltips
                document.querySelectorAll('.tooltip').forEach(function(tooltip) {
                    tooltip.addEventListener('mouseenter', function() {
                        positionTooltip(tooltip);
                    });
                });

                document.querySelectorAll('.a4-page').forEach(function(pageElement) {
                    setupOverflowObserver(pageElement);
                });

                // --- FONCTIONS POUR LES OPTIONS DE MISE EN PAGE AVANCÃ‰ES ---
                
                function initializeAdvancedLayoutControls() {
                console.log("Initializing advanced layout controls...");
                
                // Gestionnaires pour les arriÃ¨re-plans
                const bgStyleButtons = document.querySelectorAll('[data-bg-style]');
                bgStyleButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const style = this.dataset.bgStyle;
                        updateBackgroundStyle(style);
                        setActiveButton(bgStyleButtons, this);
                        
                        // Afficher/masquer les contrÃ´les spÃ©cifiques
                        const gradientControls = document.getElementById('gradient-controls');
                        const patternControls = document.getElementById('pattern-controls');
                        const textureControls = document.getElementById('texture-controls');
                        
                        if (gradientControls) gradientControls.style.display = style === 'gradient' ? 'block' : 'none';
                        if (patternControls) patternControls.style.display = style === 'pattern' ? 'block' : 'none';
                        if (textureControls) textureControls.style.display = style === 'texture' ? 'block' : 'none';
                    });
                });

                // Couleurs d'arriÃ¨re-plan
                const bgColorInput = document.getElementById('bg-color');
                if (bgColorInput) {
                    bgColorInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.setProperty('--bg-color', this.value);
                        }
                    });
                }

                // DÃ©gradÃ©s
                const gradientColor1 = document.getElementById('gradient-color-1');
                const gradientColor2 = document.getElementById('gradient-color-2');
                const gradientDirButtons = document.querySelectorAll('[data-gradient-dir]');
                
                [gradientColor1, gradientColor2].forEach(input => {
                    if (input) {
                        input.addEventListener('input', updateGradient);
                    }
                });

                gradientDirButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        updateGradientDirection(this.dataset.gradientDir);
                        setActiveButton(gradientDirButtons, this);
                    });
                });

                // Motifs
                const patternButtons = document.querySelectorAll('[data-pattern]');
                const patternOpacity = document.getElementById('pattern-opacity');
                
                patternButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const pattern = this.dataset.pattern;
                        updatePattern(pattern);
                        setActiveButton(patternButtons, this);
                    });
                });

                if (patternOpacity) {
                    patternOpacity.addEventListener('input', function() {
                        updatePatternOpacity(this.value);
                        updateRangeValue(this);
                    });
                }

                // Couleur des motifs
                const patternColorInput = document.getElementById('pattern-color');
                if (patternColorInput) {
                    patternColorInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.setProperty('--pattern-color', this.value);
                        }
                    });
                }

                // Textures
                const textureButtons = document.querySelectorAll('[data-texture]');
                textureButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const texture = this.dataset.texture;
                        updateTexture(texture);
                        setActiveButton(textureButtons, this);
                    });
                });

                // Bordures
                const borderStyleButtons = document.querySelectorAll('[data-border-style]');
                borderStyleButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const style = this.dataset.borderStyle;
                        updateBorderStyle(style);
                        setActiveButton(borderStyleButtons, this);
                        
                        // Afficher/masquer les contrÃ´les de bordure
                        const borderControls = document.getElementById('border-controls');
                        if (borderControls) {
                            borderControls.style.display = style !== 'none' ? 'block' : 'none';
                        }
                    });
                });

                // Ã‰paisseur de bordure et arrondis
                const borderWidthInput = document.getElementById('border-width');
                const borderRadiusInput = document.getElementById('border-radius');
                
                if (borderWidthInput) {
                    borderWidthInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.borderWidth = this.value + 'px';
                        }
                        updateRangeValue(this);
                    });
                }

                if (borderRadiusInput) {
                    borderRadiusInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.borderRadius = this.value + 'px';
                        }
                        updateRangeValue(this);
                    });
                }

                // Ombres
                const enableShadows = document.getElementById('enable-shadows');
                const shadowControls = ['shadow-x', 'shadow-y', 'shadow-blur', 'shadow-opacity'];
                const shadowColorInput = document.getElementById('shadow-color');
                
                if (enableShadows) {
                    enableShadows.addEventListener('change', function() {
                        const shadowControlsDiv = document.getElementById('shadow-controls');
                        if (shadowControlsDiv) {
                            shadowControlsDiv.style.display = this.checked ? 'block' : 'none';
                        }
                        updateCustomShadow();
                    });
                }

                shadowControls.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.addEventListener('input', function() {
                            updateCustomShadow();
                            updateRangeValue(this);
                        });
                    }
                });

                if (shadowColorInput) {
                    shadowColorInput.addEventListener('input', updateCustomShadow);
                }

                // Couleur de bordure
                const borderColorInput = document.getElementById('border-color');
                if (borderColorInput) {
                    borderColorInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.borderColor = this.value;
                        }
                    });
                }

                // Ombres
                const shadowButtons = document.querySelectorAll('[data-shadow]');
                shadowButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const shadow = this.dataset.shadow;
                        updateShadow(shadow);
                        setActiveButton(shadowButtons, this);
                    });
                });

                // Formes de section
                const sectionShapeButtons = document.querySelectorAll('[data-section-shape]');
                sectionShapeButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const shape = this.dataset.sectionShape;
                        updateSectionShape(shape);
                        setActiveButton(sectionShapeButtons, this);
                    });
                });

                // Padding des sections
                const sectionPaddingInput = document.getElementById('section-padding');
                if (sectionPaddingInput) {
                    sectionPaddingInput.addEventListener('input', function() {
                        const sections = document.querySelectorAll('.cv-module');
                        sections.forEach(section => {
                            section.style.padding = this.value + 'rem';
                        });
                        updateRangeValue(this);
                    });
                }

                // Orientation de la page
                const orientationButtons = document.querySelectorAll('[data-orientation]');
                orientationButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const orientation = this.dataset.orientation;
                        updatePageOrientation(orientation);
                        setActiveButton(orientationButtons, this);
                    });
                });

                // Ã‰chelle de la page
                const pageScaleInput = document.getElementById('page-scale');
                if (pageScaleInput) {
                    pageScaleInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.transform = `scale(${this.value})`;
                            preview.style.transformOrigin = 'top left';
                        }
                        updateRangeValue(this);
                    });
                }

                // Alignement du contenu
                const alignButtons = document.querySelectorAll('[data-align]');
                alignButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const align = this.dataset.align;
                        updateContentAlignment(align);
                        setActiveButton(alignButtons, this);
                    });
                });

                // Justification du texte
                const justifyButtons = document.querySelectorAll('[data-text-justify]');
                justifyButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const justify = this.dataset.textJustify;
                        updateTextJustification(justify);
                        setActiveButton(justifyButtons, this);
                    });
                });

                // Animations
                const enableAnimations = document.getElementById('enable-animations');
                const animationTypeSelect = document.getElementById('animation-type');
                const animationDurationInput = document.getElementById('animation-duration');
                
                if (enableAnimations) {
                    enableAnimations.addEventListener('change', function() {
                        const animationControls = document.getElementById('animation-controls');
                        if (animationControls) {
                            animationControls.style.display = this.checked ? 'block' : 'none';
                        }
                        updateAnimations();
                    });
                }

                if (animationTypeSelect) {
                    animationTypeSelect.addEventListener('change', updateAnimations);
                }

                if (animationDurationInput) {
                    animationDurationInput.addEventListener('input', function() {
                        updateAnimations();
                        updateRangeValue(this);
                    });
                }

                // Filtres
                const filterInputs = ['blur-filter', 'brightness-filter', 'contrast-filter', 'saturate-filter'];
                filterInputs.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.addEventListener('input', function() {
                            updateFilters();
                            updateRangeValue(this);
                        });
                    }
                });

                // Options d'impression
                const printOptimized = document.getElementById('print-optimized');
                const highContrastPrint = document.getElementById('high-contrast-print');
                
                if (printOptimized) {
                    printOptimized.addEventListener('change', updatePrintOptions);
                }

                if (highContrastPrint) {
                    highContrastPrint.addEventListener('change', updatePrintOptions);
                }

                // CÃ©sure et contrÃ´le typographique
                const hyphenation = document.getElementById('hyphenation');
                const widowOrphan = document.getElementById('widow-orphan');
                
                if (hyphenation) {
                    hyphenation.addEventListener('change', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.hyphens = this.checked ? 'auto' : 'none';
                        }
                    });
                }

                if (widowOrphan) {
                    widowOrphan.addEventListener('change', function() {
                        const preview = document.querySelector('.a4-page');
                        if (preview) {
                            preview.style.orphans = this.checked ? '2' : 'auto';
                            preview.style.widows = this.checked ? '2' : 'auto';
                        }
                    });
                }

                // Padding personnalisÃ©
                const paddingInputs = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
                paddingInputs.forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.addEventListener('input', function() {
                            updateCustomPadding();
                            updateRangeValue(this);
                        });
                    }
                });

                // Alignement de texte
                const textAlignButtons = document.querySelectorAll('[data-text-align]');
                textAlignButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const align = this.dataset.textAlign;
                        updateTextAlignment(align);
                        setActiveButton(textAlignButtons, this);
                    });
                });

                // Espacements entre colonnes
                const columnGapInput = document.getElementById('column-gap');
                if (columnGapInput) {
                    columnGapInput.addEventListener('input', function() {
                        const preview = document.querySelector('.a4-page .cv-grid');
                        if (preview) {
                            preview.style.gap = this.value + 'px';
                        }
                        updateRangeValue(this);
                    });
                }

                // Animations
                const animationButtons = document.querySelectorAll('[data-animation]');
                animationButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const animation = this.dataset.animation;
                        updateAnimation(animation);
                        setActiveButton(animationButtons, this);
                    });
                });

                // Filtres
                const filterCheckboxes = document.querySelectorAll('[data-filter]');
                filterCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', updateFilters);
                });

                // Options d'impression
                const printOptionsCheckboxes = document.querySelectorAll('.print-option');
                printOptionsCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', updatePrintOptions);
                });

                // Initialiser les valeurs de range
                document.querySelectorAll('input[type="range"]').forEach(range => {
                    updateRangeValue(range);
                    range.addEventListener('input', () => updateRangeValue(range));
                });
            }

            function updateBackgroundStyle(style) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes de background
                preview.classList.remove('bg-solid', 'bg-gradient-linear', 'bg-gradient-radial', 'bg-pattern-dots', 'bg-pattern-lines', 'bg-pattern-grid', 'bg-texture-paper', 'bg-texture-fabric');
                
                // Ajouter la classe appropriÃ©e
                switch(style) {
                    case 'solid':
                        preview.classList.add('bg-solid');
                        break;
                    case 'gradient':
                        preview.classList.add('bg-gradient-linear');
                        break;
                    case 'pattern':
                        // La classe sera ajoutÃ©e par updatePattern()
                        break;
                    case 'texture':
                        // La classe sera ajoutÃ©e par updateTexture()
                        break;
                }
            }

            function updateGradient() {
                const color1 = document.getElementById('gradient-color-1')?.value || '#ffffff';
                const color2 = document.getElementById('gradient-color-2')?.value || '#f3f4f6';
                
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    preview.style.setProperty('--gradient-color1', color1);
                    preview.style.setProperty('--gradient-color2', color2);
                }
            }

            function updateGradientDirection(direction) {
                const directionMap = {
                    'to-r': 'to right',
                    'to-br': 'to bottom right', 
                    'to-b': 'to bottom',
                    'to-bl': 'to bottom left',
                    'to-l': 'to left',
                    'to-tl': 'to top left',
                    'to-t': 'to top',
                    'to-tr': 'to top right'
                };
                
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    preview.style.setProperty('--gradient-direction', directionMap[direction] || 'to right');
                }
            }

            function updatePatternOpacity(opacity) {
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    preview.style.setProperty('--pattern-opacity', opacity);
                }
            }

            function updateCustomShadow() {
                const enableShadows = document.getElementById('enable-shadows');
                if (!enableShadows || !enableShadows.checked) {
                    const preview = document.querySelector('.a4-page');
                    if (preview) {
                        preview.style.boxShadow = 'none';
                    }
                    return;
                }

                const x = document.getElementById('shadow-x')?.value || '0';
                const y = document.getElementById('shadow-y')?.value || '2';
                const blur = document.getElementById('shadow-blur')?.value || '4';
                const color = document.getElementById('shadow-color')?.value || '#000000';
                const opacity = document.getElementById('shadow-opacity')?.value || '0.1';
                
                // Convertir hex en rgb pour l'opacitÃ©
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    preview.style.boxShadow = `${x}px ${y}px ${blur}px rgba(${r}, ${g}, ${b}, ${opacity})`;
                }
            }

            function updatePageOrientation(orientation) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                if (orientation === 'landscape') {
                    preview.style.width = '29.7cm';
                    preview.style.height = '21cm';
                } else {
                    preview.style.width = '21cm';
                    preview.style.height = '29.7cm';
                }
            }

            function updateContentAlignment(align) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                preview.style.textAlign = align;
            }

            function updateTextJustification(justify) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                if (justify === 'justify') {
                    preview.style.textAlign = 'justify';
                } else {
                    preview.style.textAlign = 'left';
                }
            }

            function updateAnimations() {
                const enableAnimations = document.getElementById('enable-animations');
                const animationType = document.getElementById('animation-type')?.value || 'fade';
                const duration = document.getElementById('animation-duration')?.value || '0.3';
                
                const sections = document.querySelectorAll('.cv-module');
                sections.forEach(section => {
                    if (enableAnimations && enableAnimations.checked) {
                        section.style.animation = `${animationType} ${duration}s ease-in-out`;
                    } else {
                        section.style.animation = 'none';
                    }
                });
            }

            function updateFilters() {
                const blur = document.getElementById('blur-filter')?.value || '0';
                const brightness = document.getElementById('brightness-filter')?.value || '100';
                const contrast = document.getElementById('contrast-filter')?.value || '100';
                const saturate = document.getElementById('saturate-filter')?.value || '100';
                
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
                    preview.style.filter = filterValue;
                }
            }

            function updatePrintOptions() {
                const printOptimized = document.getElementById('print-optimized');
                const highContrastPrint = document.getElementById('high-contrast-print');
                
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // RÃ©initialiser les styles d'impression
                preview.classList.remove('print-optimized', 'high-contrast-print');
                
                if (printOptimized && printOptimized.checked) {
                    preview.classList.add('print-optimized');
                }
                
                if (highContrastPrint && highContrastPrint.checked) {
                    preview.classList.add('high-contrast-print');
                }
            }

            function updatePattern(pattern) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes de motifs
                preview.classList.remove('bg-pattern-dots', 'bg-pattern-lines', 'bg-pattern-grid');
                
                // Ajouter la classe appropriÃ©e
                if (pattern !== 'none') {
                    preview.classList.add(`bg-pattern-${pattern}`);
                }
            }

            function updateTexture(texture) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes de textures
                preview.classList.remove('bg-texture-paper', 'bg-texture-fabric');
                
                // Ajouter la classe appropriÃ©e
                if (texture !== 'none') {
                    preview.classList.add(`bg-texture-${texture}`);
                }
            }

            function updateBorderStyle(style) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes de style de bordure
                preview.classList.remove('border-style-solid', 'border-style-dashed', 'border-style-dotted', 'border-style-double');
                
                // Ajouter la classe appropriÃ©e
                if (style !== 'none') {
                    preview.classList.add(`border-style-${style}`);
                }
            }

            function updateShadow(shadow) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes d'ombre
                preview.classList.remove('shadow-soft', 'shadow-medium', 'shadow-strong', 'shadow-colored', 'shadow-inset');
                
                // Ajouter la classe appropriÃ©e
                if (shadow !== 'none') {
                    preview.classList.add(`shadow-${shadow}`);
                }
            }

            function updateSectionShape(shape) {
                const sections = document.querySelectorAll('.cv-module');
                sections.forEach(section => {
                    // Retirer toutes les classes de forme
                    section.classList.remove('shape-rectangle', 'shape-rounded', 'shape-circle', 'shape-pill', 'shape-custom');
                    
                    // Ajouter la classe appropriÃ©e
                    if (shape !== 'none') {
                        section.classList.add(`shape-${shape}`);
                    }
                });
            }

            function updateCustomPadding() {
                const top = document.getElementById('padding-top')?.value || '0';
                const right = document.getElementById('padding-right')?.value || '0';
                const bottom = document.getElementById('padding-bottom')?.value || '0';
                const left = document.getElementById('padding-left')?.value || '0';
                
                const preview = document.querySelector('.a4-page');
                if (preview) {
                    preview.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
                }
            }

            function updateTextAlignment(align) {
                const preview = document.querySelector('.a4-page');
                if (!preview) return;

                // Retirer toutes les classes d'alignement
                preview.classList.remove('text-align-left', 'text-align-center', 'text-align-right', 'text-align-justify');
                
                // Ajouter la classe appropriÃ©e
                preview.classList.add(`text-align-${align}`);
            }

            function updateAnimation(animation) {
                const sections = document.querySelectorAll('.cv-module');
                sections.forEach(section => {
                    // Retirer toutes les classes d'animation
                    section.classList.remove('animation-fade-in', 'animation-slide-in', 'animation-zoom-in', 'animation-bounce');
                    
                    // Ajouter la classe appropriÃ©e
                    if (animation !== 'none') {
                        section.classList.add(`animation-${animation}`);
                    }
                });
            }

            function updateFilters() {
                const filters = [];
                document.querySelectorAll('[data-filter]:checked').forEach(checkbox => {
                    filters.push(checkbox.dataset.filter);
                });

                const preview = document.querySelector('.a4-page');
                if (preview) {
                    // Retirer toutes les classes de filtre
                    preview.classList.remove('filter-blur', 'filter-brightness', 'filter-contrast', 'filter-grayscale', 'filter-sepia');
                    
                    // Ajouter les filtres sÃ©lectionnÃ©s
                    filters.forEach(filter => {
                        preview.classList.add(`filter-${filter}`);
                    });
                }
            }

            function updatePrintOptions() {
                // Cette fonction peut Ãªtre Ã©tendue pour gÃ©rer des options d'impression spÃ©cifiques
                console.log('Print options updated');
            }

            function setActiveButton(buttons, activeButton) {
                buttons.forEach(btn => btn.classList.remove('active'));
                activeButton.classList.add('active');
            }

            function updateRangeValue(rangeInput) {
                const valueDisplay = rangeInput.parentNode.querySelector('.range-value');
                if (valueDisplay) {
                    valueDisplay.textContent = rangeInput.value + (rangeInput.dataset.unit || '');
                }
            }

            // --- FONCTION POUR RÃ‰DUIRE/DÃ‰VELOPPER TOUTES LES SECTIONS ---
            
            function initializeCollapseAllButton() {
                if (!controls.collapseAllBtn) return;
                
                controls.collapseAllBtn.addEventListener('click', function() {
                    toggleAllSections();
                });
            }

            function toggleAllSections() {
                const allDetails = document.querySelectorAll('details.control-group');
                const btnText = document.getElementById('collapse-btn-text');
                const btnIcon = controls.collapseAllBtn.querySelector('i');
                
                if (allDetails.length === 0) return;
                
                // VÃ©rifier si toutes les sections sont fermÃ©es
                const allClosed = Array.from(allDetails).every(detail => !detail.open);
                
                if (allClosed) {
                    // Ouvrir toutes les sections
                    allDetails.forEach(detail => {
                        detail.open = true;
                    });
                    btnText.textContent = 'RÃ©duire toutes les sections';
                    btnIcon.className = 'fas fa-compress-alt';
                    showNotification('Toutes les sections ont Ã©tÃ© dÃ©veloppÃ©es', 'success', 2000);
                } else {
                    // Fermer toutes les sections
                    allDetails.forEach(detail => {
                        detail.open = false;
                    });
                    btnText.textContent = 'DÃ©velopper toutes les sections';
                    btnIcon.className = 'fas fa-expand-alt';
                    showNotification('Toutes les sections ont Ã©tÃ© rÃ©duites', 'success', 2000);
                }
            }

            // --- NOUVELLES FONCTIONS POUR REDIMENSIONNEMENT ET ZOOM ---
            
            function initializeResizablePanels() {
                const resizeHandles = document.querySelectorAll('.resize-handle');
                
                resizeHandles.forEach(handle => {
                    let isResizing = false;
                    let startX, startY, startWidth, startHeight;
                    let targetPanel;
                    
                    handle.addEventListener('mousedown', (e) => {
                        isResizing = true;
                        const panelId = handle.getAttribute('data-panel');
                        
                        if (panelId === 'controls') {
                            targetPanel = controls.controlsPanel;
                        } else if (panelId === 'top-toolbar') {
                            targetPanel = controls.topToolbar;
                        }
                        
                        if (!targetPanel) return;
                        
                        startX = e.clientX;
                        startY = e.clientY;
                        
                        const rect = targetPanel.getBoundingClientRect();
                        startWidth = rect.width;
                        startHeight = rect.height;
                        
                        handle.classList.add('dragging');
                        document.body.style.cursor = handle.classList.contains('resize-handle-right') ? 'ew-resize' : 'ns-resize';
                        
                        e.preventDefault();
                    });
                    
                    document.addEventListener('mousemove', (e) => {
                        if (!isResizing || !targetPanel) return;
                        
                        if (handle.classList.contains('resize-handle-right')) {
                            // Redimensionnement horizontal (panneau de gauche)
                            const newWidth = startWidth + (e.clientX - startX);
                            const minWidth = 250;
                            const maxWidth = window.innerWidth * 0.6;
                            
                            if (newWidth >= minWidth && newWidth <= maxWidth) {
                                targetPanel.style.width = newWidth + 'px';
                                targetPanel.style.flexBasis = newWidth + 'px';
                            }
                        } else if (handle.classList.contains('resize-handle-bottom')) {
                            // Redimensionnement vertical (barre du haut)
                            const newHeight = startHeight + (e.clientY - startY);
                            const minHeight = 50;
                            const maxHeight = window.innerHeight * 0.3;
                            
                            if (newHeight >= minHeight && newHeight <= maxHeight) {
                                targetPanel.style.height = newHeight + 'px';
                            }
                        }
                        
                        e.preventDefault();
                    });
                    
                    document.addEventListener('mouseup', () => {
                        if (isResizing) {
                            isResizing = false;
                            handle.classList.remove('dragging');
                            document.body.style.cursor = '';
                            
                            // Sauvegarder les tailles dans localStorage
                            if (targetPanel === controls.controlsPanel) {
                                localStorage.setItem('cvCreator_controlsPanelWidth', targetPanel.style.width);
                            } else if (targetPanel === controls.topToolbar) {
                                localStorage.setItem('cvCreator_topToolbarHeight', targetPanel.style.height);
                            }
                        }
                    });
                });
                
                // Restaurer les tailles sauvegardÃ©es
                restorePanelSizes();
            }
            
            function restorePanelSizes() {
                const savedControlsWidth = localStorage.getItem('cvCreator_controlsPanelWidth');
                const savedToolbarHeight = localStorage.getItem('cvCreator_topToolbarHeight');
                
                if (savedControlsWidth && controls.controlsPanel) {
                    controls.controlsPanel.style.width = savedControlsWidth;
                    controls.controlsPanel.style.flexBasis = savedControlsWidth;
                }
                
                if (savedToolbarHeight && controls.topToolbar) {
                    controls.topToolbar.style.height = savedToolbarHeight;
                }
            }
            
            function initializePanelToggles() {
                let leftPanelVisible = true;
                let topPanelVisible = true;
                
                // Toggle panneau de gauche
                if (controls.panelToggleLeft) {
                    controls.panelToggleLeft.addEventListener('click', () => {
                        leftPanelVisible = !leftPanelVisible;
                        
                        if (leftPanelVisible) {
                            controls.controlsPanel.classList.remove('panel-hidden');
                            controls.panelToggleLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
                            controls.panelToggleLeft.title = 'Masquer le panneau de gauche';
                        } else {
                            controls.controlsPanel.classList.add('panel-hidden');
                            controls.panelToggleLeft.innerHTML = '<i class="fas fa-chevron-right"></i>';
                            controls.panelToggleLeft.title = 'Afficher le panneau de gauche';
                        }
                        
                        localStorage.setItem('cvCreator_leftPanelVisible', leftPanelVisible);
                    });
                }
                
                // Toggle barre du haut
                if (controls.panelToggleTop) {
                    controls.panelToggleTop.addEventListener('click', () => {
                        topPanelVisible = !topPanelVisible;
                        
                        if (topPanelVisible) {
                            controls.topToolbar.classList.remove('panel-hidden');
                            controls.panelToggleTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
                            controls.panelToggleTop.title = 'Masquer la barre d\'outils';
                        } else {
                            controls.topToolbar.classList.add('panel-hidden');
                            controls.panelToggleTop.innerHTML = '<i class="fas fa-chevron-down"></i>';
                            controls.panelToggleTop.title = 'Afficher la barre d\'outils';
                        }
                        
                        localStorage.setItem('cvCreator_topPanelVisible', topPanelVisible);
                    });
                }
                
                // Restaurer l'Ã©tat des panneaux
                const savedLeftPanelState = localStorage.getItem('cvCreator_leftPanelVisible');
                const savedTopPanelState = localStorage.getItem('cvCreator_topPanelVisible');
                
                if (savedLeftPanelState === 'false') {
                    controls.panelToggleLeft.click();
                }
                
                if (savedTopPanelState === 'false') {
                    controls.panelToggleTop.click();
                }
            }
            
            function initializeZoomControls() {
                let currentZoom = 100;
                
                // Fonction pour appliquer le zoom
                function applyZoom(zoomLevel) {
                    currentZoom = Math.max(25, Math.min(200, zoomLevel));
                    const scale = currentZoom / 100;
                    
                    if (preview.previewWrapper) {
                        preview.previewWrapper.style.transform = `scale(${scale})`;
                        controls.zoomValue.textContent = currentZoom + '%';
                        controls.zoomSlider.value = currentZoom;
                        
                        // Sauvegarder le niveau de zoom
                        localStorage.setItem('cvCreator_zoomLevel', currentZoom);
                    }
                }
                
                // Event listeners pour les contrÃ´les de zoom
                if (controls.zoomSlider) {
                    controls.zoomSlider.addEventListener('input', (e) => {
                        applyZoom(parseInt(e.target.value));
                    });
                }
                
                if (controls.zoomIn) {
                    controls.zoomIn.addEventListener('click', () => {
                        applyZoom(currentZoom + 10);
                    });
                }
                
                if (controls.zoomOut) {
                    controls.zoomOut.addEventListener('click', () => {
                        applyZoom(currentZoom - 10);
                    });
                }
                
                if (controls.zoomReset) {
                    controls.zoomReset.addEventListener('click', () => {
                        applyZoom(100);
                        showNotification('Zoom rÃ©initialisÃ© Ã  100%', 'success', 2000);
                    });
                }
                
                // Zoom avec la molette de la souris (Ctrl + molette)
                if (preview.previewWrapper) {
                    document.getElementById('preview-area').addEventListener('wheel', (e) => {
                        if (e.ctrlKey) {
                            e.preventDefault();
                            const delta = e.deltaY > 0 ? -5 : 5;
                            applyZoom(currentZoom + delta);
                        }
                    });
                }
                
                // Raccourcis clavier pour le zoom
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey) {
                        if (e.key === '+' || e.key === '=') {
                            e.preventDefault();
                            applyZoom(currentZoom + 10);
                        } else if (e.key === '-') {
                            e.preventDefault();
                            applyZoom(currentZoom - 10);
                        } else if (e.key === '0') {
                            e.preventDefault();
                            applyZoom(100);
                        }
                    }
                });
                
                // Restaurer le niveau de zoom sauvegardÃ©
                const savedZoom = localStorage.getItem('cvCreator_zoomLevel');
                if (savedZoom) {
                    applyZoom(parseInt(savedZoom));
                } else {
                    applyZoom(100);
                }
            }

            // --- FONCTIONS POUR LE PARTAGE ---
            
            function openShareModal() {
                if (!controls.shareModal) return;
                
                // GÃ©nÃ©rer le lien de partage
                const shareData = generateShareData();
                const shareUrl = generateShareUrl(shareData);
                
                // Mettre Ã  jour le champ input avec l'URL
                if (controls.shareLinkInput) {
                    controls.shareLinkInput.value = shareUrl;
                }
                
                // Afficher le modal
                controls.shareModal.classList.add('active');
                
                showNotification('Lien de partage gÃ©nÃ©rÃ© !', 'success', 3000);
            }

            function generateShareData() {
                // RÃ©cupÃ©rer toutes les donnÃ©es du CV
                const cvData = {
                    // Informations personnelles
                    nom: document.getElementById('nom')?.value || '',
                    prenom: document.getElementById('prenom')?.value || '',
                    poste: document.getElementById('poste')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    telephone: document.getElementById('telephone')?.value || '',
                    adresse: document.getElementById('adresse')?.value || '',
                    description: document.getElementById('description')?.value || '',
                    
                    // ExpÃ©riences
                    experiences: Array.from(document.querySelectorAll('#experience-list .experience-item')).map(item => ({
                        title: item.querySelector('[data-field="title"]')?.value || '',
                        meta: item.querySelector('[data-field="meta"]')?.value || '',
                        desc: item.querySelector('[data-field="desc"]')?.value || ''
                    })),
                    
                    // Formations
                    formations: Array.from(document.querySelectorAll('#formation-list .formation-item')).map(item => ({
                        title: item.querySelector('[data-field="title"]')?.value || '',
                        meta: item.querySelector('[data-field="meta"]')?.value || '',
                        desc: item.querySelector('[data-field="desc"]')?.value || ''
                    })),
                    
                    // CompÃ©tences
                    competences: document.getElementById('competences')?.value || '',
                    
                    // Style et couleurs
                    primaryColor: document.getElementById('primary-color-picker')?.value || '#3b82f6',
                    secondaryColor: document.getElementById('secondary-color-picker')?.value || '#334155',
                    layout: document.querySelector('.layout-btn.active')?.dataset.layout || 'layout-2-col-33-67'
                };
                
                return cvData;
            }

            function generateShareUrl(data) {
                // Encoder les donnÃ©es en base64 pour l'URL
                const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
                
                // CrÃ©er l'URL de partage
                const baseUrl = window.location.origin + window.location.pathname;
                const shareUrl = `${baseUrl}?shared=${encodedData}`;
                
                return shareUrl;
            }

            function copyShareLink() {
                if (!controls.shareLinkInput) return;
                
                // SÃ©lectionner et copier le lien
                controls.shareLinkInput.select();
                controls.shareLinkInput.setSelectionRange(0, 99999); // Pour mobile
                
                try {
                    document.execCommand('copy');
                    showNotification('Lien copiÃ© dans le presse-papiers !', 'success', 3000);
                } catch (err) {
                    // Fallback avec l'API moderne si disponible
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(controls.shareLinkInput.value).then(() => {
                            showNotification('Lien copiÃ© dans le presse-papiers !', 'success', 3000);
                        }).catch(() => {
                            showNotification('Erreur lors de la copie', 'error', 3000);
                        });
                    } else {
                        showNotification('Copiez manuellement le lien', 'info', 5000);
                    }
                }
            }

            function loadSharedCV() {
                // VÃ©rifier s'il y a des donnÃ©es partagÃ©es dans l'URL
                const urlParams = new URLSearchParams(window.location.search);
                const sharedData = urlParams.get('shared');
                
                if (sharedData) {
                    try {
                        // DÃ©coder les donnÃ©es
                        const decodedData = JSON.parse(decodeURIComponent(atob(sharedData)));
                        
                        // Charger les donnÃ©es dans le formulaire
                        loadCVData(decodedData);
                        
                        showNotification('CV partagÃ© chargÃ© avec succÃ¨s !', 'success', 5000);
                        
                        // Nettoyer l'URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                        
                    } catch (error) {
                        console.error('Erreur lors du chargement du CV partagÃ©:', error);
                        showNotification('Erreur lors du chargement du CV partagÃ©', 'error', 5000);
                    }
                }
            }

            // --- FONCTIONS D'ANIMATION IA ---
            
            function showMatrixProcessing() {
                // Animation professionnelle discrÃ¨te pour le processus d'API
                const body = document.body;
                body.style.transition = 'all 0.3s ease';
                body.style.background = 'linear-gradient(135deg, rgba(248, 250, 252, 0.02), rgba(241, 245, 249, 0.01))';
                
                // CrÃ©er quelques indicateurs professionnels discrets
                for (let i = 0; i < 4; i++) {
                    createGlobalFloatingChar(i);
                }
            }

            function hideMatrixProcessing() {
                const body = document.body;
                body.style.background = '';
                
                // Nettoyer les caractÃ¨res flottants globaux
                const floatingChars = document.querySelectorAll('.global-matrix-char');
                floatingChars.forEach(char => char.remove());
            }

            function createGlobalFloatingChar(index) {
                const char = document.createElement('div');
                char.className = 'global-matrix-char';
                char.textContent = ['â€¢', 'â—¦', 'â–ª', 'â–«'][Math.floor(Math.random() * 4)];
                char.style.cssText = `
                    position: fixed;
                    color: rgba(156, 163, 175, 0.15);
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    font-size: 10px;
                    left: ${30 + Math.random() * 40}%;
                    top: ${30 + Math.random() * 40}%;
                    z-index: 9999;
                    pointer-events: none;
                    animation: float 3s ease-in-out infinite;
                    font-weight: 400;
                `;
                
                document.body.appendChild(char);
                
                // Changer le caractÃ¨re de maniÃ¨re ultra rapide et contrÃ´lÃ©e
                const changeInterval = setInterval(() => {
                    char.textContent = ['â€¢', 'â—¦', 'â–ª', 'â–«'][Math.floor(Math.random() * 4)];
                }, 75); // Ultra rapide: 150ms -> 75ms
                
                // Nettoyer
                setTimeout(() => {
                    clearInterval(changeInterval);
                    if (char.parentNode) char.remove();
                }, 12000);
            }
            
            function showAIThinking(title = "IA Professionnelle en cours d'analyse...", subtitle = "Traitement intelligent des donnÃ©es") {
                if (!controls.aiThinkingOverlay) return;
                
                controls.aiThinkingTitle.textContent = title;
                controls.aiThinkingSubtitle.textContent = subtitle;
                controls.aiThinkingOverlay.classList.add('active');
                
                // RÃ©initialiser les Ã©tapes
                document.querySelectorAll('.ai-step').forEach((step, index) => {
                    step.classList.remove('active', 'completed');
                    if (index === 0) step.classList.add('active');
                });
                
                // DÃ©marrer l'animation Matrix dans l'overlay IA
                startAIMatrixAnimation();
                // DÃ©marrer l'animation des Ã©tapes
                startAIStepAnimation();
            }

            function hideAIThinking() {
                if (controls.aiThinkingOverlay) {
                    controls.aiThinkingOverlay.classList.remove('active');
                    // ArrÃªter l'animation Matrix
                    stopAIMatrixAnimation();
                }
            }

            // --- FONCTION D'Ã‰CRITURE MATRIX EN TEMPS RÃ‰EL ---
            
            function writeTextMatrixStyle(element, newText, callback = null) {
                console.log("writeTextMatrixStyle appelÃ© avec:", {
                    element: element,
                    elementId: element?.id,
                    newText: newText,
                    hasCallback: !!callback
                });
                
                if (!element || !newText) {
                    console.log("Ã‰lÃ©ment ou texte manquant, arrÃªt de la fonction");
                    if (callback) callback();
                    return;
                }
                
                element.style.color = '#374151';
                element.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
                element.style.textShadow = 'none';
                element.style.transition = 'all 0.08s ease';
                element.style.fontWeight = '500';
                
                let currentIndex = 0;
                const chars = ['0', '1', 'â€¢', 'â—¦', 'â–ª'];
                
                // Phase 1: Scramble initial professionnel minimal
                const scramblePhases = 1; // RÃ©duit pour plus de rapiditÃ©
                let currentPhase = 0;
                
                function scrambleText() {
                    let scrambled = '';
                    for (let i = 0; i < newText.length; i++) {
                        if (newText[i] === ' ') {
                            scrambled += ' ';
                        } else {
                            // Principalement des points discrets
                            if (Math.random() < 0.9) {
                                scrambled += Math.random() < 0.6 ? 'â€¢' : 'â—¦';
                            } else {
                                scrambled += chars[Math.floor(Math.random() * chars.length)];
                            }
                        }
                    }
                    element.textContent = scrambled;
                    element.style.opacity = '0.6';
                }
                
                // Scrambles contrÃ´lÃ©s - ultra rapides
                const scrambleInterval = setInterval(() => {
                    scrambleText();
                    currentPhase++;
                    if (currentPhase >= scramblePhases) {
                        clearInterval(scrambleInterval);
                        startMatrixWriting();
                    }
                }, 30); // Ultra rapide: 60ms -> 30ms
                
                function startMatrixWriting() {
                    element.style.textShadow = '0 0 3px rgba(55, 65, 81, 0.4)';
                    currentIndex = 0;
                    
                    const writeInterval = setInterval(() => {
                        let displayText = '';
                        
                        // Texte dÃ©jÃ  Ã©crit (stable)
                        displayText += newText.substring(0, currentIndex);
                        
                        // CaractÃ¨re en cours d'Ã©criture (avec effet)
                        if (currentIndex < newText.length) {
                            if (newText[currentIndex] === ' ') {
                                displayText += ' ';
                                currentIndex++;
                            } else {
                                // Alternance ultra rapide avant de stabiliser
                                if (Math.random() < 0.9) { // Encore plus de chance de stabiliser rapidement
                                    displayText += newText[currentIndex];
                                    currentIndex++;
                                } else {
                                    displayText += chars[Math.floor(Math.random() * 2)]; // Principalement 0 ou 1
                                }
                            }
                        }
                        
                        // Reste du texte (scrambled professionnel)
                        for (let i = currentIndex; i < newText.length; i++) {
                            if (newText[i] === ' ') {
                                displayText += ' ';
                            } else {
                                if (Math.random() < 0.95) { // Presque que des 0 et 1 pour la fluiditÃ©
                                    displayText += Math.random() < 0.5 ? '0' : '1';
                                } else {
                                    displayText += chars[Math.floor(Math.random() * chars.length)];
                                }
                            }
                        }
                        
                        element.textContent = displayText;
                        
                        // Effet de flash subtil sur le caractÃ¨re en cours
                        if (currentIndex < newText.length) {
                            element.style.textShadow = '0 0 5px rgba(55, 65, 81, 0.6)';
                            setTimeout(() => {
                                element.style.textShadow = '0 0 3px rgba(55, 65, 81, 0.4)';
                            }, 10); // Ultra rapide: 20ms -> 10ms
                        }
                        
                        if (currentIndex >= newText.length) {
                            clearInterval(writeInterval);
                            // Animation finale subtile
                            element.textContent = newText;
                            element.style.textShadow = '0 0 4px rgba(55, 65, 81, 0.5)';
                            setTimeout(() => {
                                element.style.color = '';
                                element.style.fontFamily = '';
                                element.style.textShadow = '';
                                element.style.fontWeight = '';
                                if (callback) callback();
                            }, 200); // Ultra rapide: 400ms -> 200ms
                        }
                    }, 12); // Ultra rapide: 25ms -> 12ms pour une fluiditÃ© giga
                }
            }
            
            // Fonction pour Ã©crire plusieurs Ã©lÃ©ments en sÃ©quence - ultra optimisÃ©e
            function writeMultipleElementsMatrix(elements, texts, finalCallback = null) {
                let currentElementIndex = 0;
                
                function writeNext() {
                    if (currentElementIndex >= elements.length) {
                        if (finalCallback) finalCallback();
                        return;
                    }
                    
                    const element = elements[currentElementIndex];
                    const text = texts[currentElementIndex];
                    
                    writeTextMatrixStyle(element, text, () => {
                        currentElementIndex++;
                        setTimeout(writeNext, 50); // Ultra rapide: 100ms -> 50ms entre les Ã©lÃ©ments
                    });
                }
                
                writeNext();
            }

            function startAIMatrixAnimation() {
                const neurons = document.querySelectorAll('.ai-brain .neuron');
                const professionalChars = ['â€¢', 'â—¦', 'â–ª', 'â–«', 'â€º', 'â€¹'];
                
                neurons.forEach((neuron, index) => {
                    // Style professionnel pour les colonnes de donnÃ©es
                    neuron.style.cssText += `
                        font-size: 11px;
                        opacity: 0.5;
                        transform: translateY(-20px);
                        animation: matrixFall 2s linear infinite;
                        animation-delay: ${index * 0.3}s;
                        font-weight: 400;
                        color: #9ca3af;
                    `;
                    
                    // Changer les caractÃ¨res avec un timing professionnel - ultra optimisÃ©
                    neuron.matrixInterval = setInterval(() => {
                        if (Math.random() < 0.85) {
                            // 85% de chance d'avoir des puces professionnelles
                            neuron.textContent = professionalChars[Math.floor(Math.random() * professionalChars.length)];
                        } else {
                            // 15% de chance d'avoir 0 ou 1
                            neuron.textContent = Math.random() < 0.5 ? '0' : '1';
                        }
                        
                        // Effet subtil sans flash excessif
                        neuron.style.opacity = '0.6';
                        setTimeout(() => {
                            neuron.style.opacity = '0.4';
                        }, 8); // Ultra rapide
                        
                    }, 25 + Math.random() * 35); // Ultra rapide: 25-60ms
                });
                
                // CrÃ©er des Ã©lÃ©ments flottants plus sophistiquÃ©s
                const brainContainer = document.querySelector('.ai-brain');
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        createFloatingChar(brainContainer, i);
                    }, i * 150);
                }
            }

            function createFloatingChar(container, index) {
                const floatingChar = document.createElement('div');
                const chars = ['0', '1', '0', '1', 'â–“', 'â–’', 'â–‘', 'â–ˆ'];
                floatingChar.textContent = chars[Math.floor(Math.random() * chars.length)];
                floatingChar.style.cssText = `
                    position: absolute;
                    color: #4a9eff;
                    font-family: 'Courier New', monospace;
                    font-size: ${9 + Math.random() * 4}px;
                    left: ${15 + Math.random() * 70}%;
                    top: ${10 + Math.random() * 70}%;
                    text-shadow: 0 0 6px rgba(74, 158, 255, 0.8);
                    pointer-events: none;
                    z-index: 10;
                    animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
                    opacity: 0.7;
                    font-weight: 500;
                `;
                
                container.appendChild(floatingChar);
                
                // Changer le caractÃ¨re de maniÃ¨re plus contrÃ´lÃ©e
                const changeInterval = setInterval(() => {
                    if (Math.random() < 0.75) {
                        floatingChar.textContent = Math.random() < 0.5 ? '0' : '1';
                    } else {
                        floatingChar.textContent = chars[Math.floor(Math.random() * chars.length)];
                    }
                }, 120 + Math.random() * 180);
                
                // Nettoyer aprÃ¨s un certain temps
                setTimeout(() => {
                    clearInterval(changeInterval);
                    if (floatingChar.parentNode) {
                        floatingChar.remove();
                    }
                }, 10000);
            }

            function stopAIMatrixAnimation() {
                const neurons = document.querySelectorAll('.ai-brain .neuron');
                neurons.forEach(neuron => {
                    if (neuron.matrixInterval) {
                        clearInterval(neuron.matrixInterval);
                        neuron.matrixInterval = null;
                    }
                });
                
                // Nettoyer les caractÃ¨res flottants
                const floatingChars = document.querySelectorAll('.ai-brain div:not(.neuron)');
                floatingChars.forEach(char => {
                    if (char.parentNode) {
                        char.remove();
                    }
                });
            }

            function cleanupMatrixEffects(cvPages) {
                cvPages.forEach(page => {
                    const container = page.querySelector('.matrix-rain-container');
                    if (container) {
                        // ArrÃªter l'interval de pulse
                        if (container.pulseInterval) {
                            clearInterval(container.pulseInterval);
                        }
                        
                        // Nettoyer tous les intervals des caractÃ¨res
                        const chars = container.querySelectorAll('.matrix-column div');
                        chars.forEach(char => {
                            if (char.changeInterval) {
                                clearInterval(char.changeInterval);
                            }
                        });
                        
                        container.remove();
                    }
                    
                    // Restaurer les styles de la page
                    page.style.boxShadow = '';
                    page.style.transform = '';
                    page.style.filter = '';
                    
                    // Restaurer les modules
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach(module => {
                        module.style.background = '';
                        module.style.borderLeft = '';
                        module.style.boxShadow = '';
                        module.style.transform = '';
                        module.style.animation = '';
                        
                        // Nettoyer les lignes de scan
                        const scanLines = module.querySelectorAll('div[style*="scanHorizontal"]');
                        scanLines.forEach(line => line.remove());
                    });
                });
            }

            // --- FONCTIONS D'ANIMATION MATRIX RAIN INTÃ‰GRÃ‰E SPECTACULAIRE ---
            
            function showCVRestructureAnimation() {
                const cvPreview = document.querySelector('#cv-preview-wrapper');
                const cvPages = document.querySelectorAll('.a4-page');
                
                if (!cvPreview || !cvPages.length) return Promise.resolve();
                
                // DÃ©marrer l'animation professionnelle ultra-rapide directement sur le CV
                return new Promise((resolve) => {
                    // PHASE 1: Initialisation professionnelle (0-200ms)
                    startProfessionalDataFlow(cvPages);
                    showNotification("ðŸ” Scanning CV data...", "info", 500);
                    
                    setTimeout(() => {
                        // PHASE 2: Intensification + transformation du contenu (200ms-800ms)
                        intensifyProfessionalFlow(cvPages);
                        transformCVContentProfessional(cvPages);
                        showNotification("ðŸ’» Processing with AI...", "info", 600);
                    }, 200);
                    
                    setTimeout(() => {
                        // PHASE 3: Reconstruction avec effet de digitalisation (800ms-1400ms)
                        startProfessionalReconstruction(cvPages);
                        showNotification("ðŸ§  Optimizing layout...", "info", 600);
                    }, 800);
                    
                    setTimeout(() => {
                        // PHASE 4: Finalisation avec effet de compilation (1400ms-1800ms)
                        finalizeProfessionalCompilation(cvPages);
                        showNotification("âœ¨ Optimization complete...", "success", 400);
                    }, 1400);
                    
                    setTimeout(() => {
                        // PHASE 5: Nettoyage et rÃ©vÃ©lation finale (1800ms-2000ms)
                        cleanupProfessionalEffects(cvPages);
                        resolve();
                    }, 1800);
                });
            }
            
            function hideCVRestructureAnimation() {
                const cvPages = document.querySelectorAll('.a4-page');
                cleanupProfessionalEffects(cvPages);
            }
            
            function startMatrixRainEffect(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                startProfessionalDataFlow(cvPages);
            }

            function intensifyMatrixRain(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                intensifyProfessionalFlow(cvPages);
            }

            function transformCVContentMatrix(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                transformCVContentProfessional(cvPages);
            }

            function startMatrixReconstruction(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                startProfessionalReconstruction(cvPages);
            }

            function finalizeMatrixCompilation(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                finalizeProfessionalCompilation(cvPages);
            }

            function cleanupMatrixEffects(cvPages) {
                // Redirection vers la nouvelle fonction professionnelle
                cleanupProfessionalEffects(cvPages);
            }

            // Temporary placeholder - orphaned code removed

            function startProfessionalDataFlow(cvPages) {
                // Professional animation implementation
                cvPages.forEach(page => {
                    const container = document.createElement('div');
                    container.className = 'professional-flow-container';
                    container.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        pointer-events: none;
                        z-index: 1000;
                    `;
                    page.style.position = 'relative';
                    page.appendChild(container);
                    
                    // Clean up after animation
                    setTimeout(() => {
                        if (container.parentNode) {
                            container.remove();
                        }
                    }, 2000);
                });
            }
            
            function startProfessionalDataFlow(cvPages) {
                cvPages.forEach((page, pageIndex) => {
                    // CrÃ©er un conteneur de flux de donnÃ©es professionnel
                    const flowContainer = document.createElement('div');
                    flowContainer.className = 'professional-flow-container';
                    flowContainer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 1000;
                        pointer-events: none;
                        overflow: hidden;
                        background: linear-gradient(135deg, rgba(248, 250, 252, 0.02), rgba(241, 245, 249, 0.01));
                    `;
                    
                    page.style.position = 'relative';
                    page.appendChild(flowContainer);
                    
                    // CrÃ©er 15 colonnes de flux professionnels (lÃ©ger et Ã©lÃ©gant)
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => {
                            createProfessionalColumn(flowContainer, i);
                        }, i * 20);
                    }
                    
                    // Effet de glow subtil professionnel sur la page
                    page.style.transition = 'all 0.3s ease';
                    page.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(59, 130, 246, 0.1)';
                    
                    // Animation pulsante discrÃ¨te professionnelle
                    let pulseInterval = setInterval(() => {
                        page.style.boxShadow = page.style.boxShadow.includes('0.1') 
                            ? '0 6px 20px rgba(0, 0, 0, 0.12), 0 3px 10px rgba(59, 130, 246, 0.15)' 
                            : '0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(59, 130, 246, 0.1)';
                    }, 600);
                    
                    flowContainer.pulseInterval = pulseInterval;
                });
            }
            
            function createProfessionalColumn(container, columnIndex) {
                const column = document.createElement('div');
                column.className = 'professional-column';
                column.style.cssText = `
                    position: absolute;
                    left: ${(columnIndex * 100) / 15}%;
                    top: -100%;
                    width: 20px;
                    height: 100%;
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    font-size: 10px;
                    color: rgba(156, 163, 175, 0.3);
                    text-align: center;
                    animation: professionalFall 2s linear infinite;
                    animation-delay: ${columnIndex * 0.1}s;
                    font-weight: 400;
                `;
                
                // GÃ©nÃ©rer du contenu professionnel
                const chars = ['â€¢', 'â—¦', 'â–ª', 'â–«', 'â€º', 'â€¹', '0', '1'];
                let content = '';
                for (let i = 0; i < 20; i++) {
                    content += chars[Math.floor(Math.random() * chars.length)] + '\n';
                }
                column.textContent = content;
                
                container.appendChild(column);
                
                // Changer les caractÃ¨res de faÃ§on ultra-rapide
                column.changeInterval = setInterval(() => {
                    let newContent = '';
                    for (let i = 0; i < 20; i++) {
                        newContent += chars[Math.floor(Math.random() * chars.length)] + '\n';
                    }
                    column.textContent = newContent;
                }, 50);
            }
            
            function intensifyProfessionalFlow(cvPages) {
                cvPages.forEach(page => {
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach((module, index) => {
                        setTimeout(() => {
                            // Effet de scan professionnel
                            module.style.transition = 'all 0.2s ease';
                            module.style.background = 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.9))';
                            module.style.borderLeft = '2px solid rgba(59, 130, 246, 0.3)';
                            module.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
                        }, index * 40);
                    });
                });
            }
            
            function transformCVContentProfessional(cvPages) {
                cvPages.forEach(page => {
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach((module, index) => {
                        setTimeout(() => {
                            // Effet de transformation ultra-rapide
                            module.style.animation = 'professionalTransform 0.3s ease-out';
                            
                            setTimeout(() => {
                                module.style.animation = '';
                            }, 300);
                        }, index * 30);
                    });
                });
            }
            
            function startProfessionalReconstruction(cvPages) {
                cvPages.forEach(page => {
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach((module, index) => {
                        setTimeout(() => {
                            // Reset des effets prÃ©cÃ©dents
                            module.style.background = '';
                            module.style.borderLeft = '';
                            
                            // Effet de scan horizontal professionnel
                            const scanLine = document.createElement('div');
                            scanLine.style.cssText = `
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                height: 1px;
                                background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), transparent);
                                z-index: 1003;
                                animation: professionalScan 0.4s ease-out;
                            `;
                            module.appendChild(scanLine);
                            
                            setTimeout(() => {
                                if (scanLine.parentNode) {
                                    scanLine.remove();
                                }
                            }, 400);
                            
                        }, index * 50);
                    });
                });
            }
            
            function finalizeProfessionalCompilation(cvPages) {
                cvPages.forEach(page => {
                    // Effet de finalisation professionnel ultra-subtil
                    const compilationOverlay = document.createElement('div');
                    compilationOverlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(45deg, 
                            rgba(248, 250, 252, 0.1) 0%, 
                            rgba(59, 130, 246, 0.05) 50%, 
                            rgba(241, 245, 249, 0.1) 100%);
                        z-index: 1004;
                        animation: professionalFlash 0.4s ease-out;
                        pointer-events: none;
                    `;
                    
                    page.appendChild(compilationOverlay);
                    
                    setTimeout(() => {
                        if (compilationOverlay.parentNode) {
                            compilationOverlay.remove();
                        }
                    }, 400);
                });
            }
            
            function cleanupProfessionalEffects(cvPages) {
                cvPages.forEach(page => {
                    // Nettoyer tous les effets professionnels
                    page.style.animation = '';
                    page.style.boxShadow = '';
                    page.style.transition = '';
                    
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach(module => {
                        module.style.transition = '';
                        module.style.background = '';
                        module.style.borderLeft = '';
                        module.style.boxShadow = '';
                        module.style.animation = '';
                    });
                    
                    // Retirer tous les Ã©lÃ©ments d'animation professionnels
                    const professionalElements = page.querySelectorAll(
                        '.professional-flow-container, .professional-column, .scan-line'
                    );
                    professionalElements.forEach(el => {
                        if (el.changeInterval) clearInterval(el.changeInterval);
                        if (el.pulseInterval) clearInterval(el.pulseInterval);
                        el.remove();
                    });
                    
                    // Effet de rÃ©vÃ©lation finale professionnel
                    page.style.animation = 'professionalReveal 0.2s ease-out';
                    setTimeout(() => {
                        page.style.animation = '';
                    }, 200);
                });
            }
            
            // === ANIMATIONS CSS PROFESSIONNELLES ===
            
            function simulateTyping(element, text, speed = 50) {
                if (!element) return Promise.resolve();
                
                return new Promise((resolve) => {
                    let i = 0;
                    element.value = '';
                    
                    const typeInterval = setInterval(() => {
                        if (i < text.length) {
                            element.value += text.charAt(i);
                            i++;
                            // DÃ©clencher l'Ã©vÃ©nement input pour mettre Ã  jour l'aperÃ§u
                            element.dispatchEvent(new Event('input'));
                        } else {
                            clearInterval(typeInterval);
                            resolve();
                        }
                    }, speed);
                });
            }
            
            // --- NOUVELLES FONCTIONS IA AVANCÃ‰ES ---
            
            async function generateAchievements() {
                cvPages.forEach(page => {
                    const modules = page.querySelectorAll('.cv-module');
                    
                    // Effet de reconstruction avec particules dorÃ©es
                    modules.forEach((module, index) => {
                        setTimeout(() => {
                            // CrÃ©er l'effet de reconstruction
                            module.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                            module.style.transform = 'translateX(0) translateY(0) scale(1.05) rotate(0deg)';
                            module.style.opacity = '1';
                            module.style.filter = 'blur(0)';
                            module.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                            
                            // Effet de construction avec lignes dorÃ©es
                            createReconstructionLines(module);
                            
                            setTimeout(() => {
                                module.style.transform = 'scale(1)';
                                module.style.boxShadow = '';
                            }, 800);
                            
                        }, index * 200);
                    });
                    
                    // ArrÃªter l'effet de tremblement
                    page.style.animation = '';
                });
            }
            
            function startCVFinalizationEffect(cvPages) {
                cvPages.forEach(page => {
                    // Effet d'Ã©clat final sur toute la page
                    const glowOverlay = document.createElement('div');
                    glowOverlay.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
                        z-index: 999;
                        animation: finalGlow 1s ease-out;
                        pointer-events: none;
                    `;
                    
                    page.appendChild(glowOverlay);
                    
                    // Effet de brillance sur les textes
                    const textElements = page.querySelectorAll('h1, h2, .section-title');
                    textElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.style.animation = 'textSparkle 0.8s ease-out';
                        }, index * 100);
                    });
                    
                    // Retirer l'overlay aprÃ¨s l'animation
                    setTimeout(() => {
                        if (glowOverlay.parentNode) {
                            glowOverlay.remove();
                        }
                    }, 1000);
                });
            }
            
            function cleanupCVAnimationEffects(cvPages) {
                cvPages.forEach(page => {
                    // Nettoyer tous les effets
                    page.style.animation = '';
                    
                    const modules = page.querySelectorAll('.cv-module');
                    modules.forEach(module => {
                        module.style.transition = '';
                        module.style.transform = '';
                        module.style.opacity = '';
                        module.style.filter = '';
                        module.style.boxShadow = '';
                        module.style.animation = '';
                    });
                    
                    const textElements = page.querySelectorAll('h1, h2, .section-title');
                    textElements.forEach(element => {
                        element.style.animation = '';
                    });
                    
                    // Retirer tous les Ã©lÃ©ments d'animation ajoutÃ©s
                    const animationElements = page.querySelectorAll('.cv-scan-line, .module-particle, .reconstruction-line, .glow-overlay');
                    animationElements.forEach(el => el.remove());
                });
            }
            
            function createModuleParticles(module) {
                for (let i = 0; i < 8; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'module-particle';
                    particle.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #0088ff;
                        border-radius: 50%;
                        z-index: 1001;
                        pointer-events: none;
                        top: ${Math.random() * 100}%;
                        left: ${Math.random() * 100}%;
                        animation: particleFloat 1.5s ease-out forwards;
                    `;
                    
                    module.appendChild(particle);
                    
                    // Retirer la particule aprÃ¨s l'animation
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.remove();
                        }
                    }, 1500);
                }
            }
            
            function createReconstructionLines(module) {
                // CrÃ©er des lignes dorÃ©es qui "construisent" le module
                for (let i = 0; i < 4; i++) {
                    const line = document.createElement('div');
                    line.className = 'reconstruction-line';
                    line.style.cssText = `
                        position: absolute;
                        background: linear-gradient(90deg, transparent, #ffd700, transparent);
                        z-index: 1001;
                        pointer-events: none;
                        ${i % 2 === 0 ? 'height: 2px; width: 100%; top: ' + (25 * i) + '%; left: 0;' : 'width: 2px; height: 100%; left: ' + (25 * (i-1)) + '%; top: 0;'}
                        animation: lineConstruct 0.8s ease-out;
                    `;
                    
                    module.appendChild(line);
                    
                    setTimeout(() => {
                        if (line.parentNode) {
                            line.remove();
                        }
                    }, 800);
                }
            }
            
            function createFlyingLetters() {
                const lettersContainer = document.getElementById('letters-container');
                if (!lettersContainer) return;
                
                const words = ['CV', 'EXPÃ‰RIENCE', 'FORMATION', 'COMPÃ‰TENCES', 'PROJET', 'OPTIMISATION', 'IA', 'DESIGN', 'CARRIÃˆRE', 'TALENT'];
                const letters = words.join(' ').split('');
                const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
                
                letters.forEach((letter, index) => {
                    if (letter.trim()) {
                        const letterEl = document.createElement('div');
                        letterEl.className = 'flying-letter';
                        letterEl.textContent = letter;
                        
                        // Couleur alÃ©atoire
                        letterEl.style.color = colors[Math.floor(Math.random() * colors.length)];
                        
                        // Position initiale alÃ©atoire dans un cercle
                        const angle = (index / letters.length) * 360 + Math.random() * 60;
                        const radius = 200 + Math.random() * 100;
                        const startX = Math.cos(angle * Math.PI / 180) * radius;
                        const startY = Math.sin(angle * Math.PI / 180) * radius;
                        
                        letterEl.style.left = `50%`;
                        letterEl.style.top = `50%`;
                        letterEl.style.transform = `translate(${startX}px, ${startY}px)`;
                        
                        // Variables CSS personnalisÃ©es pour l'animation plus complexe
                        letterEl.style.setProperty('--random-x', `${Math.random() * 500 - 250}px`);
                        letterEl.style.setProperty('--random-y', `${Math.random() * 400 - 200}px`);
                        letterEl.style.setProperty('--random-x2', `${Math.random() * 300 - 150}px`);
                        letterEl.style.setProperty('--random-y2', `${Math.random() * 200 - 100}px`);
                        letterEl.style.setProperty('--random-x3', `${Math.random() * 200 - 100}px`);
                        letterEl.style.setProperty('--random-y3', `${Math.random() * 150 - 75}px`);
                        letterEl.style.setProperty('--final-x', `${(index % 8 - 4) * 15}px`);
                        letterEl.style.setProperty('--final-y', `${Math.floor(index / 8) * 40 - 60}px`);
                        letterEl.style.setProperty('--random-rotation', `${Math.random() * 720 - 360}deg`);
                        letterEl.style.setProperty('--random-rotation2', `${Math.random() * 720 - 360}deg`);
                        letterEl.style.setProperty('--random-rotation3', `${Math.random() * 720 - 360}deg`);
                        
                        letterEl.style.animationDelay = `${index * 0.05}s`;
                        letterEl.style.fontSize = `${1.2 + Math.random() * 0.8}rem`;
                        
                        lettersContainer.appendChild(letterEl);
                    }
                });
            }
            
            function createMagicParticles() {
                const particlesContainer = document.getElementById('magic-particles');
                if (!particlesContainer) return;
                
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    // Position initiale alÃ©atoire
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    
                    // Variables CSS pour l'animation
                    particle.style.setProperty('--particle-x', `${Math.random() * 200 - 100}px`);
                    particle.style.setProperty('--particle-y', `${Math.random() * 200 - 100}px`);
                    particle.style.setProperty('--particle-x2', `${Math.random() * 150 - 75}px`);
                    particle.style.setProperty('--particle-y2', `${Math.random() * 150 - 75}px`);
                    particle.style.setProperty('--particle-x3', `${Math.random() * 300 - 150}px`);
                    particle.style.setProperty('--particle-y3', `${Math.random() * 300 - 150}px`);
                    
                    particle.style.animationDelay = `${Math.random() * 3}s`;
                    particle.style.animationDuration = `${2 + Math.random() * 2}s`;
                    
                    particlesContainer.appendChild(particle);
                }
            }
            
            function createBuildingElements() {
                const lettersContainer = document.getElementById('letters-container');
                if (!lettersContainer) return;
                
                // CrÃ©er des Ã©lÃ©ments de construction (rectangles reprÃ©sentant les sections du CV)
                const elements = [
                    { width: 200, height: 40, x: 300, y: 150, delay: 0 }, // Titre
                    { width: 150, height: 20, x: 325, y: 200, delay: 0.2 }, // Contact
                    { width: 180, height: 60, x: 310, y: 240, delay: 0.4 }, // ExpÃ©rience
                    { width: 160, height: 40, x: 320, y: 320, delay: 0.6 }, // Formation
                    { width: 140, height: 50, x: 330, y: 380, delay: 0.8 }  // CompÃ©tences
                ];
                
                elements.forEach((elem, index) => {
                    const buildEl = document.createElement('div');
                    buildEl.className = 'building-element';
                    buildEl.style.width = `${elem.width}px`;
                    buildEl.style.height = `${elem.height}px`;
                    buildEl.style.left = `${elem.x}px`;
                    buildEl.style.top = `${elem.y}px`;
                    buildEl.style.animationDelay = `${elem.delay}s`;
                    
                    lettersContainer.appendChild(buildEl);
                });
            }

            function startAIStepAnimation() {
                const steps = document.querySelectorAll('.ai-step');
                const actions = [
                    "Lecture et analyse du contenu...",
                    "Traitement par l'intelligence artificielle...",
                    "GÃ©nÃ©ration du contenu optimisÃ©...",
                    "Application des modifications..."
                ];
                
                let currentStep = 0;
                
                const stepInterval = setInterval(() => {
                    if (currentStep > 0) {
                        steps[currentStep - 1].classList.remove('active');
                        steps[currentStep - 1].classList.add('completed');
                    }
                    
                    if (currentStep < steps.length) {
                        steps[currentStep].classList.add('active');
                        controls.aiCurrentAction.textContent = actions[currentStep] || "Finalisation...";
                        currentStep++;
                    } else {
                        clearInterval(stepInterval);
                        controls.aiCurrentAction.textContent = "TerminÃ© !";
                    }
                }, 1000);
            }

            function highlightFieldChange(fieldElement) {
                if (fieldElement) {
                    fieldElement.classList.add('cv-field-highlight');
                    setTimeout(() => {
                        fieldElement.classList.remove('cv-field-highlight');
                    }, 2000);
                }
            }

            function simulateTyping(element, text, speed = 50) {
                if (!element) return Promise.resolve();
                
                return new Promise((resolve) => {
                    let i = 0;
                    element.value = '';
                    
                    const typeInterval = setInterval(() => {
                        if (i < text.length) {
                            element.value += text.charAt(i);
                            i++;
                            // DÃ©clencher l'Ã©vÃ©nement input pour mettre Ã  jour l'aperÃ§u
                            element.dispatchEvent(new Event('input'));
                        } else {
                            clearInterval(typeInterval);
                            highlightFieldChange(element);
                            resolve();
                        }
                    }, speed);
                });
            }

            // --- NOUVELLES FONCTIONS IA ---
            
            async function optimizeAllCV() {
                if (!validateApiKey()) {
                    showNotification("Veuillez configurer votre clÃ© API Gemini d'abord.", "error");
                    return;
                }

                // Lancer l'animation spectaculaire de restructuration
                const animationPromise = showCVRestructureAnimation();
                
                try {
                    const cvContent = {
                        nom: document.getElementById('nom')?.value || '',
                        prenom: document.getElementById('prenom')?.value || '',
                        poste: document.getElementById('poste')?.value || '',
                        description: document.getElementById('description')?.value || '',
                        experiences: Array.from(document.querySelectorAll('#experience-list .experience-item')).map(item => ({
                            title: item.querySelector('[data-field="title"]')?.value || '',
                            meta: item.querySelector('[data-field="meta"]')?.value || '',
                            desc: item.querySelector('[data-field="desc"]')?.value || ''
                        })),
                        competences: document.getElementById('competences')?.value || ''
                    };

                    const prompt = `En tant qu'expert en ressources humaines et rÃ©daction de CV, optimise ce CV complet pour le rendre plus impactant et professionnel.

                    CV actuel:
                    Nom: ${cvContent.nom} ${cvContent.prenom}
                    Poste: ${cvContent.poste}
                    Description: ${cvContent.description}
                    CompÃ©tences: ${cvContent.competences}
                    
                    ExpÃ©riences:
                    ${cvContent.experiences.map((exp, i) => `${i+1}. ${exp.title} - ${exp.meta}\n${exp.desc}`).join('\n\n')}
                    
                    AmÃ©liore tous les Ã©lÃ©ments: descriptions plus percutantes, orthographe, syntaxe, structure.`;

                    const schema = {
                        type: "OBJECT",
                        properties: {
                            poste: { type: "STRING", description: "Titre de poste optimisÃ©" },
                            description: { type: "STRING", description: "Description de profil amÃ©liorÃ©e" },
                            competences: { type: "STRING", description: "Liste de compÃ©tences optimisÃ©e" },
                            experiences: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        title: { type: "STRING" },
                                        meta: { type: "STRING" },
                                        desc: { type: "STRING" }
                                    }
                                }
                            }
                        }
                    };

                    const result = await callGeminiAPI(prompt, schema);
                    
                    if (result) {
                        // Appliquer les amÃ©liorations avec animation
                        if (result.poste) await simulateTyping(document.getElementById('poste'), result.poste);
                        if (result.description) await simulateTyping(document.getElementById('description'), result.description);
                        if (result.competences) await simulateTyping(document.getElementById('competences'), result.competences);
                        
                        // Mettre Ã  jour les expÃ©riences
                        if (result.experiences) {
                            const expItems = document.querySelectorAll('#experience-list .experience-item');
                            for (let i = 0; i < Math.min(result.experiences.length, expItems.length); i++) {
                                const exp = result.experiences[i];
                                const item = expItems[i];
                                if (exp.title) await simulateTyping(item.querySelector('[data-field="title"]'), exp.title);
                                if (exp.meta) await simulateTyping(item.querySelector('[data-field="meta"]'), exp.meta);
                                if (exp.desc) await simulateTyping(item.querySelector('[data-field="desc"]'), exp.desc);
                            }
                        }
                        
                        // Attendre la fin de l'animation
                        await animationPromise;
                        
                        showNotification("âœ¨ CV entiÃ¨rement restructurÃ© et optimisÃ© ! âœ¨", "success", 5000);
                    }
                } catch (error) {
                    console.error("Erreur lors de l'optimisation:", error);
                    showNotification("Erreur lors de l'optimisation du CV", "error");
                    hideCVRestructureAnimation();
                } finally {
                    // L'animation se cache automatiquement
                }
            }

            async function rewriteDescriptions() {
                if (!validateApiKey()) {
                    showNotification("Veuillez configurer votre clÃ© API Gemini d'abord.", "error");
                    return;
                }

                showAIThinking("RÃ©Ã©criture matricielle", "Reformulation binaire des donnÃ©es");
                
                try {
                    const experiences = Array.from(document.querySelectorAll('#experience-list .experience-item')).map(item => ({
                        title: item.querySelector('[data-field="title"]')?.value || '',
                        meta: item.querySelector('[data-field="meta"]')?.value || '',
                        desc: item.querySelector('[data-field="desc"]')?.value || '',
                        element: item
                    }));

                    for (const exp of experiences) {
                        if (exp.desc.trim()) {
                            const prompt = `RÃ©Ã©cris cette description d'expÃ©rience professionnelle pour la rendre plus impactante et professionnelle:
                            
                            Poste: ${exp.title}
                            Entreprise/PÃ©riode: ${exp.meta}
                            Description actuelle: ${exp.desc}
                            
                            Rends la description plus dynamique, utilise des verbes d'action, quantifie les rÃ©sultats si possible.`;

                            const result = await callGeminiAPI(prompt, {
                                type: "OBJECT",
                                properties: {
                                    description: { type: "STRING", description: "Description rÃ©Ã©crite et amÃ©liorÃ©e" }
                                }
                            });

                            if (result && result.description) {
                                const targetElement = exp.element.querySelector('[data-field="desc"]');
                                targetElement.value = '';
                                writeTextMatrixStyle(targetElement, result.description);
                            }
                        }
                    }
                    
                    showNotification("Descriptions rÃ©Ã©crites par la Matrix ! âœï¸", "success", 5000);
                } catch (error) {
                    console.error("Erreur lors de la rÃ©Ã©criture:", error);
                    showNotification("Erreur lors de la rÃ©Ã©criture des descriptions", "error");
                } finally {
                    hideAIThinking();
                }
            }

            function loadCVData(data) {
                // Charger les informations personnelles
                if (data.nom) document.getElementById('nom').value = data.nom;
                if (data.prenom) document.getElementById('prenom').value = data.prenom;
                if (data.poste) document.getElementById('poste').value = data.poste;
                if (data.email) document.getElementById('email').value = data.email;
                if (data.telephone) document.getElementById('telephone').value = data.telephone;
                if (data.adresse) document.getElementById('adresse').value = data.adresse;
                if (data.description) document.getElementById('description').value = data.description;
                if (data.competences) document.getElementById('competences').value = data.competences;
                
                // Charger les couleurs
                if (data.primaryColor) {
                    document.getElementById('primary-color-picker').value = data.primaryColor;
                    document.getElementById('primary-color-picker').dispatchEvent(new Event('input'));
                }
                if (data.secondaryColor) {
                    document.getElementById('secondary-color-picker').value = data.secondaryColor;
                    document.getElementById('secondary-color-picker').dispatchEvent(new Event('input'));
                }
                
                // Charger la mise en page
                if (data.layout) {
                    const layoutBtn = document.querySelector(`[data-layout="${data.layout}"]`);
                    if (layoutBtn) {
                        layoutBtn.click();
                    }
                }
                
                // Mettre Ã  jour l'aperÃ§u
                updatePreview('all');
            }
            
            // --- START THE APP ---
            initializeAll();
            loadSharedCV(); // VÃ©rifier s'il y a un CV partagÃ© Ã  charger
            resetCVToDefault(); // Start with a clean slate
            
            // --- NOUVELLES FONCTIONS IA AVANCÃ‰ES ---
            
            async function generateAchievements() {
                try {
                    showAIThinking('GÃ©nÃ©ration binaire de rÃ©alisations', 'La Matrix analyse vos expÃ©riences pour gÃ©nÃ©rer des rÃ©alisations percutantes...');
                    
                    const experiences = Array.from(document.querySelectorAll('#experiences .experience-item')).map(exp => {
                        return {
                            title: exp.querySelector('input[placeholder="Titre du poste"]')?.value || '',
                            company: exp.querySelector('input[placeholder="Nom de l\'entreprise"]')?.value || '',
                            description: exp.querySelector('textarea[placeholder="Description de vos responsabilitÃ©s..."]')?.value || ''
                        };
                    });
                    
                    const prompt = `En tant qu'expert en rÃ©daction de CV, gÃ©nÃ©rez des rÃ©alisations quantifiÃ©es et percutantes pour ces expÃ©riences professionnelles :
                    
                    ${experiences.map((exp, index) => `
                    ${index + 1}. ${exp.title} chez ${exp.company}
                    Description actuelle : ${exp.description}
                    `).join('\n')}
                    
                    Pour chaque expÃ©rience, proposez 2-3 rÃ©alisations concrÃ¨tes avec des chiffres, pourcentages ou rÃ©sultats mesurables.
                    Format souhaitÃ© : "â€¢ [RÃ©alisation avec chiffres et impact]"`;
                    
                    const result = await callGeminiAPI(prompt);
                    
                    // Simulation de mise Ã  jour progressive
                    const lines = result.split('\n').filter(line => line.trim());
                    let currentExpIndex = 0;
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].includes('â€¢')) {
                            const expElement = document.querySelectorAll('#experiences .experience-item')[currentExpIndex];
                            if (expElement) {
                                const textarea = expElement.querySelector('textarea[placeholder="Description de vos responsabilitÃ©s..."]');
                                if (textarea) {
                                    textarea.value += '\n' + lines[i];
                                    await simulateTyping(textarea, lines[i]);
                                }
                            }
                        } else if (lines[i].match(/^\d+\./)) {
                            currentExpIndex++;
                        }
                    }
                    
                    hideAIThinking();
                    showNotification('âœ¨ RÃ©alisations gÃ©nÃ©rÃ©es avec succÃ¨s !', 'success');
                } catch (error) {
                    hideAIThinking();
                    showNotification('âŒ Erreur lors de la gÃ©nÃ©ration des rÃ©alisations', 'error');
                    console.error('Erreur gÃ©nÃ©ration rÃ©alisations:', error);
                }
            }
            
            async function suggestSkills() {
                try {
                    showAIThinking('Analyse Matrix des compÃ©tences', 'La Matrix analyse votre profil pour suggÃ©rer des compÃ©tences pertinentes...');
                    
                    const profile = document.querySelector('#about textarea')?.value || '';
                    const experiences = Array.from(document.querySelectorAll('#experiences .experience-item')).map(exp => {
                        return exp.querySelector('textarea')?.value || '';
                    }).join(' ');
                    
                    const currentSkills = Array.from(document.querySelectorAll('#skills .skill-item')).map(skill => {
                        return skill.querySelector('input')?.value || '';
                    });
                    
                    const prompt = `En tant qu'expert RH, analysez ce profil professionnel et suggÃ©rez 5-8 compÃ©tences supplÃ©mentaires pertinentes :
                    
                    Profil : ${profile}
                    ExpÃ©riences : ${experiences}
                    CompÃ©tences actuelles : ${currentSkills.join(', ')}
                    
                    SuggÃ©rez des compÃ©tences techniques et comportementales qui manquent et qui seraient valorisantes pour ce profil.
                    RÃ©pondez uniquement avec une liste de compÃ©tences sÃ©parÃ©es par des virgules.`;
                    
                    const result = await callGeminiAPI(prompt);
                    const suggestedSkills = result.split(',').map(s => s.trim()).filter(s => s.length > 0);
                    
                    // Ajouter progressivement les compÃ©tences
                    for (const skill of suggestedSkills.slice(0, 6)) {
                        const addBtn = document.querySelector('#skills .add-skill');
                        if (addBtn) {
                            addBtn.click();
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            const skillItems = document.querySelectorAll('#skills .skill-item');
                            const newSkill = skillItems[skillItems.length - 1];
                            const input = newSkill.querySelector('input');
                            if (input) {
                                await simulateTyping(input, skill);
                            }
                        }
                    }
                    
                    hideAIThinking();
                    showNotification('ðŸŽ¯ CompÃ©tences suggÃ©rÃ©es et ajoutÃ©es !', 'success');
                } catch (error) {
                    hideAIThinking();
                    showNotification('âŒ Erreur lors de la suggestion de compÃ©tences', 'error');
                    console.error('Erreur suggestion compÃ©tences:', error);
                }
            }
            
            async function improveProfile() {
                try {
                    showAIThinking('AmÃ©lioration binaire du profil', 'La Matrix restructure votre profil pour maximiser l\'impact...');
                    
                    const profileTextarea = document.querySelector('#about textarea');
                    const currentProfile = profileTextarea?.value || '';
                    
                    if (!currentProfile.trim()) {
                        hideAIThinking();
                        showNotification('âš ï¸ Veuillez d\'abord remplir votre profil', 'warning');
                        return;
                    }
                    
                    const prompt = `En tant qu'expert en personal branding, rÃ©Ã©crivez ce profil professionnel pour le rendre plus percutant et mÃ©morable :
                    
                    Profil actuel : ${currentProfile}
                    
                    AmÃ©liorez-le en :
                    - CommenÃ§ant par un accroche forte
                    - Utilisant des mots d'action puissants
                    - Quantifiant les rÃ©alisations quand possible
                    - Terminant par une proposition de valeur claire
                    - Gardant un ton professionnel mais engageant
                    
                    Limitez Ã  4-5 phrases maximum.`;
                    
                    const improvedProfile = await callGeminiAPI(prompt);
                    
                    // Animation Matrix de rÃ©Ã©criture
                    profileTextarea.value = '';
                    writeTextMatrixStyle(profileTextarea, improvedProfile, () => {
                        hideAIThinking();
                        showNotification('âœ¨ Profil amÃ©liorÃ© par la Matrix !', 'success');
                    });
                } catch (error) {
                    hideAIThinking();
                    showNotification('âŒ Erreur lors de l\'amÃ©lioration du profil', 'error');
                    console.error('Erreur amÃ©lioration profil:', error);
                }
            }
            
            async function adaptToSector() {
                try {
                    showAIThinking('Adaptation sectorielle Matrix', 'La Matrix adapte votre CV au secteur cible...');
                    
                    // Demander le secteur cible
                    const sector = prompt('Dans quel secteur souhaitez-vous adapter votre CV ? (ex: Tech, Finance, Marketing, SantÃ©...)');
                    if (!sector) {
                        hideAIThinking();
                        return;
                    }
                    
                    const profileTextarea = document.querySelector('#about textarea');
                    const currentProfile = profileTextarea?.value || '';
                    
                    const experiences = Array.from(document.querySelectorAll('#experiences .experience-item')).map(exp => {
                        return exp.querySelector('textarea')?.value || '';
                    });
                    
                    const prompt = `En tant qu'expert du secteur ${sector}, adaptez ce CV pour maximiser son impact dans ce domaine :
                    
                    Profil actuel : ${currentProfile}
                    ExpÃ©riences : ${experiences.join('\n---\n')}
                    
                    Adaptez le profil en utilisant :
                    - Le vocabulaire spÃ©cifique au secteur ${sector}
                    - Les compÃ©tences valorisÃ©es dans ce domaine
                    - Les tendances actuelles du secteur
                    
                    Proposez uniquement le nouveau profil adaptÃ©.`;
                    
                    const adaptedProfile = await callGeminiAPI(prompt);
                    
                    // Animation Matrix de mise Ã  jour
                    profileTextarea.value = '';
                    writeTextMatrixStyle(profileTextarea, adaptedProfile, () => {
                        hideAIThinking();
                        showNotification(`ðŸŽ¯ CV adaptÃ© au secteur ${sector} par la Matrix !`, 'success');
                    });
                } catch (error) {
                    hideAIThinking();
                    showNotification('âŒ Erreur lors de l\'adaptation sectorielle', 'error');
                    console.error('Erreur adaptation secteur:', error);
                }
            }
            
            async function boostKeywords() {
                try {
                    showAIThinking('Optimisation Matrix des mots-clÃ©s', 'La Matrix enrichit votre CV avec des mots-clÃ©s stratÃ©giques...');
                    
                    const jobTitle = prompt('Pour quel poste/mÃ©tier souhaitez-vous optimiser les mots-clÃ©s ? (ex: DÃ©veloppeur Full Stack, Chef de projet, Consultant...)');
                    if (!jobTitle) {
                        hideAIThinking();
                        return;
                    }
                    
                    const allContent = {
                        profile: document.querySelector('#about textarea')?.value || '',
                        experiences: Array.from(document.querySelectorAll('#experiences .experience-item textarea')).map(t => t.value).join(' '),
                        skills: Array.from(document.querySelectorAll('#skills .skill-item input')).map(i => i.value).join(' ')
                    };
                    
                    const prompt = `En tant qu'expert ATS (Applicant Tracking System), identifiez et intÃ©grez naturellement les mots-clÃ©s essentiels pour le poste "${(jobTitle || '').replace(/`/g, '').replace(/\$/g, '')}" dans ce CV :
                    
                    Contenu actuel : ${JSON.stringify(allContent)}
                    
                    Proposez 10-15 mots-clÃ©s/expressions clÃ©s pertinents pour ce poste, en prÃ©cisant oÃ¹ les intÃ©grer naturellement dans le CV.
                    Format : "MOT-CLÃ‰ : suggestion d'intÃ©gration"`;
                    
                    const keywords = await callGeminiAPI(prompt);
                    
                    // Afficher les suggestions dans une fenÃªtre modale
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    modal.innerHTML = `
                        <div class="bg-white rounded-xl p-6 max-w-2xl max-h-80vh overflow-y-auto">
                            <h3 class="text-xl font-bold mb-4">ðŸŽ¯ Mots-clÃ©s suggÃ©rÃ©s pour "${jobTitle?.replace(/"/g, '&quot;') || ''}"</h3>
                            <div class="whitespace-pre-line text-sm mb-4">${keywords?.replace(/`/g, '&#96;')?.replace(/\$/g, '&#36;') || ''}</div>
                            <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="this.closest('.fixed').remove()">
                                Compris
                            </button>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    hideAIThinking();
                    showNotification('ðŸ“ Mots-clÃ©s suggÃ©rÃ©s ! IntÃ©grez-les manuellement selon les recommandations.', 'success');
                } catch (error) {
                    hideAIThinking();
                    showNotification('âŒ Erreur lors de l\'optimisation des mots-clÃ©s', 'error');
                    console.error('Erreur mots-clÃ©s:', error);
                }
            }
            
            // Initialisation de l'application
            setupAccessibilityModal();
            loadAccessibilitySettings();
            setupKeyboardShortcuts();
            setupTemplateManager();
            
            // S'assurer que l'Ã©tat initial de la banniÃ¨re est correct
            setTimeout(() => {
                updatePreview('form');
                updateAllStyles();
            }, 100);
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
        }
        
    }); // Fermeture de DOMContentLoaded
    
    
