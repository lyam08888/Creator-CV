// Script de diagnostic pour identifier les problèmes dans l'application CV
(function() {
    console.log('🔍 DIAGNOSTIC: Starting comprehensive application diagnosis...');
    
    // Attendre que le DOM soit complètement chargé
    function runDiagnostic() {
        console.log('🔍 DIAGNOSTIC: Running full system check...');
        
        // 1. Vérifier la présence des éléments critiques
        const criticalElements = [
            '#analyze-btn',
            '#toolbar-pdf-btn',
            '#toolbar-new-cv-btn',
            '#toolbar-accessibility-btn',
            '#toolbar-share-btn',
            '#toolbar-anonymize-btn',
            '#toolbar-presentation-btn',
            '#toolbar-overflow-btn',
            '#toolbar-save-btn',
            '#toolbar-load-btn',
            '#add-experience',
            '#add-formation',
            '#nom',
            '#prenom',
            '#poste',
            '#cv-preview-wrapper'
        ];
        
        console.log('🔍 DIAGNOSTIC: Checking critical elements...');
        const missingElements = [];
        const foundElements = [];
        
        criticalElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                foundElements.push(selector);
                console.log(`✅ Found: ${selector}`, element);
            } else {
                missingElements.push(selector);
                console.error(`❌ Missing: ${selector}`);
            }
        });
        
        // 2. Vérifier les gestionnaires d'événements
        console.log('🔍 DIAGNOSTIC: Checking event listeners...');
        const buttonsWithListeners = [];
        const buttonsWithoutListeners = [];
        
        foundElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                // Vérifier si l'élément a des listeners (méthode approximative)
                const hasListeners = element._injectionRepaired || 
                                   element.onclick || 
                                   element.getAttribute('onclick') ||
                                   (element.outerHTML.includes('addEventListener'));
                
                if (hasListeners) {
                    buttonsWithListeners.push(selector);
                    console.log(`✅ Has listeners: ${selector}`);
                } else {
                    buttonsWithoutListeners.push(selector);
                    console.warn(`⚠️ No listeners detected: ${selector}`);
                }
            }
        });
        
        // 3. Vérifier les dépendances externes
        console.log('🔍 DIAGNOSTIC: Checking external dependencies...');
        const dependencies = {
            'Tailwind CSS': typeof tailwind !== 'undefined' || document.querySelector('script[src*="tailwindcss"]'),
            'Font Awesome': document.querySelector('link[href*="font-awesome"]') || document.querySelector('i.fas, i.far, i.fab'),
            'html2pdf': typeof html2pdf !== 'undefined',
            'SortableJS': typeof Sortable !== 'undefined',
            'Local Storage': typeof Storage !== 'undefined'
        };
        
        Object.entries(dependencies).forEach(([name, available]) => {
            if (available) {
                console.log(`✅ ${name}: Available`);
            } else {
                console.warn(`⚠️ ${name}: Not available or not loaded`);
            }
        });
        
        // 4. Vérifier les erreurs JavaScript
        console.log('🔍 DIAGNOSTIC: Checking for JavaScript errors...');
        const originalError = window.onerror;
        const errors = [];
        
        window.onerror = function(message, source, lineno, colno, error) {
            errors.push({ message, source, lineno, colno, error });
            console.error('🚨 JavaScript Error:', { message, source, lineno, colno, error });
            if (originalError) originalError.apply(this, arguments);
        };
        
        // 5. Tester les fonctions critiques
        console.log('🔍 DIAGNOSTIC: Testing critical functions...');
        
        // Test de sauvegarde localStorage
        try {
            localStorage.setItem('diagnostic_test', 'test');
            localStorage.removeItem('diagnostic_test');
            console.log('✅ localStorage: Working');
        } catch (e) {
            console.error('❌ localStorage: Failed', e);
        }
        
        // Test de génération d'événements
        try {
            const testEvent = new Event('test');
            console.log('✅ Event generation: Working');
        } catch (e) {
            console.error('❌ Event generation: Failed', e);
        }
        
        // 6. Générer le rapport de diagnostic
        const report = {
            timestamp: new Date().toISOString(),
            criticalElements: {
                found: foundElements.length,
                missing: missingElements.length,
                missingList: missingElements
            },
            eventListeners: {
                withListeners: buttonsWithListeners.length,
                withoutListeners: buttonsWithoutListeners.length,
                withoutListenersList: buttonsWithoutListeners
            },
            dependencies,
            errors: errors.length,
            recommendations: []
        };
        
        // 7. Générer des recommandations
        if (missingElements.length > 0) {
            report.recommendations.push('Des éléments critiques sont manquants. Vérifiez la structure HTML.');
        }
        
        if (buttonsWithoutListeners.length > 0) {
            report.recommendations.push('Certains boutons n\'ont pas de gestionnaires d\'événements. Utilisez le script de réparation.');
        }
        
        if (!dependencies['html2pdf']) {
            report.recommendations.push('html2pdf n\'est pas chargé. La génération PDF utilisera window.print().');
        }
        
        if (errors.length > 0) {
            report.recommendations.push('Des erreurs JavaScript ont été détectées. Consultez la console pour plus de détails.');
        }
        
        // 8. Afficher le rapport
        console.log('📊 DIAGNOSTIC REPORT:', report);
        
        // Créer une interface visuelle pour le rapport
        createDiagnosticModal(report);
        
        return report;
    }
    
    // Créer une modal de diagnostic
    function createDiagnosticModal(report) {
        const modal = document.createElement('div');
        modal.id = 'diagnostic-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); display: flex; align-items: center;
            justify-content: center; z-index: 10000; font-family: monospace;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white; padding: 2rem; border-radius: 0.5rem;
            max-width: 800px; max-height: 80vh; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        const statusColor = report.criticalElements.missing === 0 && report.eventListeners.withoutListeners === 0 ? '#10b981' : '#ef4444';
        
        content.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
                <div style="width: 20px; height: 20px; border-radius: 50%; background: ${statusColor}; margin-right: 1rem;"></div>
                <h2 style="margin: 0; font-size: 1.5rem; font-weight: bold;">🔍 Rapport de Diagnostic</h2>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: #374151;">📊 Résumé</h3>
                <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; font-size: 0.9rem;">
                    <div>✅ Éléments trouvés: ${report.criticalElements.found}</div>
                    <div>❌ Éléments manquants: ${report.criticalElements.missing}</div>
                    <div>🔗 Boutons avec listeners: ${report.eventListeners.withListeners}</div>
                    <div>⚠️ Boutons sans listeners: ${report.eventListeners.withoutListeners}</div>
                    <div>🚨 Erreurs détectées: ${report.errors}</div>
                </div>
            </div>
            
            ${report.criticalElements.missingList.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: #ef4444;">❌ Éléments Manquants</h3>
                <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem;">
                    ${report.criticalElements.missingList.map(el => `<div>• ${el}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${report.eventListeners.withoutListenersList.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: #f59e0b;">⚠️ Boutons Sans Listeners</h3>
                <div style="background: #fffbeb; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem;">
                    ${report.eventListeners.withoutListenersList.map(el => `<div>• ${el}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: #374151;">🔧 Dépendances</h3>
                <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem;">
                    ${Object.entries(report.dependencies).map(([name, available]) => 
                        `<div>${available ? '✅' : '❌'} ${name}</div>`
                    ).join('')}
                </div>
            </div>
            
            ${report.recommendations.length > 0 ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="margin-bottom: 0.5rem; color: #7c3aed;">💡 Recommandations</h3>
                <div style="background: #faf5ff; padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem;">
                    ${report.recommendations.map(rec => `<div>• ${rec}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            <div style="text-align: right; margin-top: 2rem;">
                <button onclick="this.closest('#diagnostic-modal').remove();" 
                        style="background: #6b7280; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem;">
                    Fermer
                </button>
                <button onclick="window.location.reload();" 
                        style="background: #3b82f6; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer;">
                    Recharger la page
                </button>
            </div>
            
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; 
                        font-size: 0.7rem; color: #6b7280; text-align: center;">
                Diagnostic effectué le ${new Date().toLocaleString()}
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Fermer avec Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('diagnostic-modal')) {
                document.getElementById('diagnostic-modal').remove();
            }
        });
    }
    
    // Exposer la fonction de diagnostic globalement
    window.runDiagnostic = runDiagnostic;
    
    // Lancer le diagnostic automatiquement après un délai
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runDiagnostic, 2000); // Attendre 2 secondes après le chargement
        });
    } else {
        setTimeout(runDiagnostic, 2000);
    }
    
    console.log('🔍 DIAGNOSTIC: Script loaded. Use window.runDiagnostic() to run manual diagnosis.');
    
})();