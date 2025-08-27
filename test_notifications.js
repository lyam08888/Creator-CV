// Script de test pour les notifications modernes
console.log('🧪 TEST: Script de test des notifications chargé');

// Attendre que la page soit chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 TEST: DOM chargé, ajout du bouton de test');
    
    // Créer un bouton de test pour les notifications
    const testButton = document.createElement('button');
    testButton.id = 'test-notifications-btn';
    testButton.innerHTML = '🧪 Tester les notifications';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 10001;
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(testButton);
    
    let testCounter = 0;
    
    testButton.addEventListener('click', function() {
        testCounter++;
        
        // Tester différents types de notifications
        const tests = [
            { title: 'Test Succès', message: 'Ceci est une notification de succès', type: 'success' },
            { title: 'Test Erreur', message: 'Ceci est une notification d\'erreur', type: 'error' },
            { title: 'Test Avertissement', message: 'Ceci est une notification d\'avertissement', type: 'warning' },
            { title: 'Test Information', message: 'Ceci est une notification d\'information', type: 'info' }
        ];
        
        const currentTest = tests[(testCounter - 1) % tests.length];
        
        console.log(`🧪 TEST: Lancement du test ${testCounter} - ${currentTest.type}`);
        
        // Vérifier si la fonction showNotification existe
        if (typeof window.showNotification === 'function') {
            console.log('✅ TEST: Fonction showNotification trouvée dans window');
            window.showNotification(currentTest.title, currentTest.message, currentTest.type, 4000);
        } else {
            console.log('❌ TEST: Fonction showNotification non trouvée dans window');
            
            // Essayer d'appeler directement la fonction du script principal
            const container = document.getElementById('notification-container');
            if (container) {
                console.log('✅ TEST: Conteneur de notifications trouvé, création manuelle');
                
                const notificationId = `test-notification-${testCounter}`;
                const icons = {
                    success: 'fas fa-check-circle',
                    error: 'fas fa-exclamation-circle',
                    warning: 'fas fa-exclamation-triangle',
                    info: 'fas fa-info-circle'
                };

                const toast = document.createElement('div');
                toast.className = `toast ${currentTest.type}`;
                toast.id = notificationId;
                
                toast.innerHTML = `
                    <div class="toast-icon">
                        <i class="${icons[currentTest.type]}"></i>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${currentTest.title}</div>
                        <div class="toast-message">${currentTest.message}</div>
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

                const progressBar = toast.querySelector('.toast-progress');
                progressBar.style.transition = 'width 4000ms linear';
                
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
                }, 4000);
                
                console.log('✅ TEST: Notification créée manuellement');
            } else {
                console.log('❌ TEST: Conteneur de notifications non trouvé');
                alert(`TEST: ${currentTest.title}\n${currentTest.message}`);
            }
        }
    });
    
    console.log('✅ TEST: Bouton de test ajouté en haut à gauche');
});

// Test automatique après 3 secondes
setTimeout(() => {
    console.log('🧪 TEST: Test automatique des notifications...');
    
    const testBtn = document.getElementById('test-notifications-btn');
    if (testBtn) {
        testBtn.click();
        console.log('✅ TEST: Test automatique lancé');
    } else {
        console.log('❌ TEST: Bouton de test non trouvé pour le test automatique');
    }
}, 3000);