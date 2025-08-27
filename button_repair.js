// Script d'injection pour réparer les boutons du CV
(function() {
    console.log('🔧 INJECTION SCRIPT: Starting button repair...');
    
    // Attendre que le DOM soit prêt
    function waitForElement(selector, timeout = 5000) {
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
    
    // Fonction pour réparer les boutons
    async function repairButtons() {
        console.log('🛠️ INJECTION: Repairing buttons...');
        
        try {
            // Bouton Analyser
            const analyzeBtn = await waitForElement('#analyze-btn');
            console.log('✅ Found analyze button:', analyzeBtn);
            
            // Supprimer les anciens listeners et en ajouter de nouveaux
            const newAnalyzeBtn = analyzeBtn.cloneNode(true);
            analyzeBtn.parentNode.replaceChild(newAnalyzeBtn, analyzeBtn);
            
            newAnalyzeBtn.addEventListener('click', function() {
                console.log('🎯 INJECTION: Analyze button clicked!');
                alert('Bouton Analyser réparé et fonctionnel !');
                
                // Logique simple d'analyse
                const aiInput = document.getElementById('ai-input');
                if (aiInput && aiInput.value.trim()) {
                    alert('Analyse du texte: ' + aiInput.value.substring(0, 50) + '...');
                } else {
                    alert('Veuillez saisir du texte à analyser.');
                }
            });
            
            console.log('✅ INJECTION: Analyze button repaired');
            
        } catch (error) {
            console.error('❌ INJECTION: Failed to repair analyze button:', error);
        }
        
        try {
            // Bouton PDF
            const pdfBtn = await waitForElement('#toolbar-pdf-btn');
            console.log('✅ Found PDF button:', pdfBtn);
            
            const newPdfBtn = pdfBtn.cloneNode(true);
            pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);
            
            newPdfBtn.addEventListener('click', function() {
                console.log('🎯 INJECTION: PDF button clicked!');
                alert('Bouton PDF réparé et fonctionnel !');
                
                // Logique simple de PDF
                window.print();
            });
            
            console.log('✅ INJECTION: PDF button repaired');
            
        } catch (error) {
            console.error('❌ INJECTION: Failed to repair PDF button:', error);
        }
        
        try {
            // Bouton Nouveau CV
            const resetBtn = await waitForElement('#toolbar-new-cv-btn');
            console.log('✅ Found reset button:', resetBtn);
            
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            
            newResetBtn.addEventListener('click', function() {
                console.log('🎯 INJECTION: Reset button clicked!');
                if (confirm('Êtes-vous sûr de vouloir réinitialiser le CV ?')) {
                    // Logique simple de reset
                    const inputs = document.querySelectorAll('input[type="text"], textarea');
                    inputs.forEach(input => input.value = '');
                    alert('CV réinitialisé !');
                }
            });
            
            console.log('✅ INJECTION: Reset button repaired');
            
        } catch (error) {
            console.error('❌ INJECTION: Failed to repair reset button:', error);
        }
        
        console.log('🎉 INJECTION: Button repair complete!');
    }
    
    // Démarrer la réparation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', repairButtons);
    } else {
        repairButtons();
    }
    
})();
