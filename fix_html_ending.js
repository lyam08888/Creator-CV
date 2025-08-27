// Script pour réparer automatiquement la fin du fichier HTML
console.log('🔧 HTML REPAIR: Starting HTML file repair...');

// Contenu HTML manquant à ajouter
const missingHtmlContent = `                                    <button data-gauge-style="stars" class="gauge-style-btn bg-gray-200 p-2 rounded-md text-sm" title="Étoiles"><i class="fas fa-star"></i></button>
                                    <button data-gauge-style="squares" class="gauge-style-btn bg-gray-200 p-2 rounded-md text-sm" title="Carrés"><i class="fas fa-square"></i></button>
                                    <button data-gauge-style="number" class="gauge-style-btn bg-gray-200 p-2 rounded-md text-sm font-bold" title="Chiffres">⅗</button>
                                </div>
                                <div id="skills-level-list" class="space-y-2 border-t pt-3"></div>
                                <div class="tooltip">
                                    <button id="add-skill-level-btn" class="w-full bg-blue-100 text-blue-800 py-2 px-4 rounded-md hover:bg-blue-200 flex items-center justify-center gap-2 text-sm"><i class="fas fa-plus-circle"></i> Ajouter une compétence</button>
                                    <div class="tooltip-content top">
                                        <strong>Ajouter une compétence avec niveau</strong><br>
                                        Ajoute une nouvelle compétence avec un niveau<br>
                                        de maîtrise affiché sous forme de jauge<br>
                                        (barres, étoiles, points ou chiffres).
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>

                    <!-- Langues -->
                    <details class="control-group">
                        <summary><span>Langues</span><label class="completion-label"><input type="checkbox" id="completion-content-langues" class="completion-checkbox"><span>Fait ✅</span></label></summary>
                        <div class="control-group-content space-y-3">
                            <div class="flex justify-end mb-2">
                                <button id="add-language" class="text-sm text-blue-600 hover:text-blue-800 font-medium"><i class="fas fa-circle-plus"></i> Ajouter une langue</button>
                            </div>
                            <div id="language-list" class="space-y-2"></div>
                        </div>
                    </details>

                    <!-- Certifications -->
                    <details class="control-group">
                        <summary><span>Certifications</span><label class="completion-label"><input type="checkbox" id="completion-content-certifs" class="completion-checkbox"><span>Fait ✅</span></label></summary>
                        <div class="control-group-content space-y-3">
                            <div class="flex justify-end mb-2">
                                <button id="add-certification" class="text-sm text-blue-600 hover:text-blue-800 font-medium"><i class="fas fa-circle-plus"></i> Ajouter une certification</button>
                            </div>
                            <div id="certification-list" class="space-y-2"></div>
                        </div>
                    </details>

                    <!-- Projets -->
                    <details class="control-group">
                        <summary><span>Projets</span><label class="completion-label"><input type="checkbox" id="completion-content-projets" class="completion-checkbox"><span>Fait ✅</span></label></summary>
                        <div class="control-group-content space-y-3">
                            <div class="flex justify-end mb-2">
                                <button id="add-project" class="text-sm text-blue-600 hover:text-blue-800 font-medium"><i class="fas fa-circle-plus"></i> Ajouter un projet</button>
                            </div>
                            <div id="project-list" class="space-y-2"></div>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </div>

    <!-- SCRIPTS -->
    <script src="script.js"></script>
    <script src="modern_notifications_repair.js"></script>
    <script src="test_notifications.js"></script>
</body>
</html>`;

// Fonction pour réparer le HTML
function repairHtmlFile() {
    console.log('🔧 HTML REPAIR: Attempting to repair HTML structure...');
    
    // Vérifier si les éléments manquent
    const missingElements = [
        '#add-language',
        '#add-certification', 
        '#add-project'
    ];
    
    let needsRepair = false;
    missingElements.forEach(selector => {
        if (!document.querySelector(selector)) {
            needsRepair = true;
            console.log(`❌ HTML REPAIR: Missing element: ${selector}`);
        }
    });
    
    if (needsRepair) {
        console.log('🔧 HTML REPAIR: HTML structure incomplete, attempting dynamic repair...');
        
        // Trouver le dernier élément connu
        const lastKnownElement = document.querySelector('button[data-gauge-style="dots"]');
        if (lastKnownElement) {
            const parentContainer = lastKnownElement.closest('.control-group-content');
            if (parentContainer) {
                console.log('✅ HTML REPAIR: Found insertion point, adding missing content...');
                
                // Créer un conteneur temporaire pour parser le HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = missingHtmlContent;
                
                // Insérer le contenu manquant
                const parentDetails = parentContainer.closest('details');
                const mainContainer = parentDetails.parentNode;
                
                // Ajouter les éléments manquants
                while (tempDiv.firstChild) {
                    if (tempDiv.firstChild.nodeType === Node.ELEMENT_NODE) {
                        mainContainer.appendChild(tempDiv.firstChild);
                    } else {
                        tempDiv.removeChild(tempDiv.firstChild);
                    }
                }
                
                console.log('✅ HTML REPAIR: Missing content added successfully!');
                
                // Créer une notification de succès
                setTimeout(() => {
                    if (typeof window.showNotification === 'function') {
                        window.showNotification(
                            'Structure HTML réparée',
                            'Les éléments manquants ont été restaurés automatiquement',
                            'success',
                            4000
                        );
                    }
                }, 1000);
            }
        }
    } else {
        console.log('✅ HTML REPAIR: HTML structure is complete, no repair needed.');
    }
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', repairHtmlFile);
} else {
    repairHtmlFile();
}

// Ajouter un bouton de réparation manuelle
document.addEventListener('DOMContentLoaded', function() {
    const repairButton = document.createElement('button');
    repairButton.id = 'manual-repair-btn';
    repairButton.innerHTML = '🔧 Réparer HTML';
    repairButton.style.cssText = `
        position: fixed;
        top: 60px;
        left: 10px;
        z-index: 10001;
        background: #ef4444;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    `;
    
    repairButton.addEventListener('click', function() {
        console.log('🔧 MANUAL REPAIR: Manual repair triggered');
        repairHtmlFile();
        
        if (typeof window.showNotification === 'function') {
            window.showNotification(
                'Réparation manuelle',
                'Tentative de réparation de la structure HTML',
                'info',
                3000
            );
        }
    });
    
    document.body.appendChild(repairButton);
    console.log('🔧 HTML REPAIR: Manual repair button added');
});

console.log('🔧 HTML REPAIR: Repair script loaded and ready!');