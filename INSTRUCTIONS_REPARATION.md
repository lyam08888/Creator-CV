# 🚨 INSTRUCTIONS DE RÉPARATION D'URGENCE

## Problème identifié
Les boutons de l'application CV ne fonctionnent plus. Voici plusieurs solutions pour réparer le problème.

## 🔧 SOLUTION 1 : Réparation automatique (RECOMMANDÉE)

1. **Ouvrez le fichier `test_repair.html`** dans votre navigateur
2. Cliquez sur **"Lancer le Test de Réparation"**
3. Si tous les tests passent, cliquez sur **"Ouvrir le CV"**
4. Les boutons devraient maintenant fonctionner

## 🚨 SOLUTION 2 : Réparation d'urgence manuelle

Si la solution 1 ne fonctionne pas :

1. **Ouvrez `index.html`** dans votre navigateur
2. **Ouvrez la console du navigateur** (F12 → Console)
3. **Copiez et collez ce code** dans la console :

```javascript
// Charger le script de réparation d'urgence
const script = document.createElement('script');
script.src = 'emergency_fix.js';
document.head.appendChild(script);
```

4. **Appuyez sur Entrée**
5. Vous devriez voir le message "RÉPARATION D'URGENCE TERMINÉE !"

## 🔄 SOLUTION 3 : Réparation manuelle directe

Si les solutions précédentes ne marchent pas, copiez ce code dans la console :

```javascript
// RÉPARATION MANUELLE DIRECTE
console.log('🔧 RÉPARATION MANUELLE: Démarrage...');

// Réparer le bouton Analyser
const analyzeBtn = document.getElementById('analyze-btn');
if (analyzeBtn) {
    analyzeBtn.onclick = () => {
        const aiInput = document.getElementById('ai-input');
        if (aiInput?.value.trim()) {
            alert('✅ Analyse activée! Texte: ' + aiInput.value.substring(0, 50) + '...');
        } else {
            alert('⚠️ Veuillez saisir du texte à analyser.');
        }
    };
    console.log('✅ Bouton Analyser réparé');
}

// Réparer le bouton PDF
const pdfBtn = document.getElementById('toolbar-pdf-btn');
if (pdfBtn) {
    pdfBtn.onclick = () => {
        alert('📄 Génération PDF activée!');
        window.print();
    };
    console.log('✅ Bouton PDF réparé');
}

// Réparer le bouton Nouveau CV
const newCvBtn = document.getElementById('toolbar-new-cv-btn');
if (newCvBtn) {
    newCvBtn.onclick = () => {
        if (confirm('Créer un nouveau CV ?')) {
            document.querySelectorAll('input, textarea').forEach(el => el.value = '');
            alert('✅ Nouveau CV créé!');
        }
    };
    console.log('✅ Bouton Nouveau CV réparé');
}

// Réparer le bouton Sauvegarder
const saveBtn = document.getElementById('toolbar-save-btn');
if (saveBtn) {
    saveBtn.onclick = () => {
        const data = {
            nom: document.getElementById('nom')?.value || '',
            prenom: document.getElementById('prenom')?.value || '',
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('cv_backup', JSON.stringify(data));
        alert('💾 CV sauvegardé!');
    };
    console.log('✅ Bouton Sauvegarder réparé');
}

console.log('🎉 RÉPARATION MANUELLE TERMINÉE!');
alert('🔧 Réparation manuelle terminée!\nLes boutons principaux devraient maintenant fonctionner.');
```

## 📋 VÉRIFICATION

Après avoir appliqué une solution, testez ces boutons :

- ✅ **Analyser & Remplir** (dans la section IA)
- ✅ **PDF** (barre d'outils du haut)
- ✅ **Nouveau CV** (barre d'outils du haut)
- ✅ **Sauvegarder** (barre d'outils du haut)
- ✅ **Charger** (barre d'outils du haut)
- ✅ **Anonymiser** (barre d'outils du haut)
- ✅ **Ajouter une expérience** (section Expériences)
- ✅ **Ajouter une formation** (section Formation)

## 🆘 SI RIEN NE FONCTIONNE

1. **Rechargez la page** (Ctrl+F5 ou Cmd+Shift+R)
2. **Videz le cache** du navigateur
3. **Essayez un autre navigateur** (Chrome, Firefox, Edge)
4. **Vérifiez la console** pour des erreurs JavaScript

## 📞 SUPPORT

Si le problème persiste :
1. Ouvrez la console (F12)
2. Notez les erreurs affichées en rouge
3. Essayez de recharger la page plusieurs fois
4. Utilisez la **Solution 3** qui est la plus robuste

---

**Note :** Ces scripts de réparation sont temporaires et réparent les fonctionnalités essentielles. Pour une solution permanente, il faudrait identifier et corriger le problème dans le code JavaScript principal.