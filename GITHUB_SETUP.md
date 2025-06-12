# 🚀 Instructions GitHub - Build APK Automatique

## 📋 Étapes à suivre pour générer l'APK

### 1. Créer un Repository GitHub
1. Allez sur https://github.com
2. Cliquez sur "New repository" 
3. Nom : `AlertHeure` (ou autre)
4. Description : `Application React Native de suivi d'horaires`
5. Cochez "Public" (nécessaire pour GitHub Actions gratuit)
6. **NE PAS** initialiser avec README (on a déjà le nôtre)
7. Cliquez "Create repository"

### 2. Pousser le Code
Copiez les commandes affichées par GitHub, exemple :
```bash
git remote add origin https://github.com/VOTRE-USERNAME/AlertHeure.git
git branch -M main
git push -u origin main
```

### 3. Attendre le Build
1. Allez dans l'onglet **"Actions"** de votre repo
2. Vous verrez "Build Android APK" en cours d'exécution
3. Attendez 10-15 minutes pour que le build se termine

### 4. Télécharger l'APK
1. Cliquez sur le build terminé (avec ✅)
2. Scrollez vers le bas jusqu'à "Artifacts"
3. Cliquez sur **"AlertHeure-debug-apk"**
4. Téléchargez le fichier ZIP
5. Extrayez pour obtenir `app-debug.apk`

### 5. Installer sur Android
1. Transférez l'APK sur votre téléphone
2. Activez "Sources inconnues" dans Paramètres > Sécurité
3. Ouvrez l'APK avec le gestionnaire de fichiers
4. Installez l'application

## 🔄 Builds Futurs
À chaque modification du code :
1. `git add .`
2. `git commit -m "Description des modifications"`
3. `git push`
4. → APK automatiquement regénéré !

## ⚡ Alternative Express
Si vous préférez ne pas créer de repo GitHub, vous pouvez :
1. Zipper ce dossier
2. L'uploader sur buildbot.space ou similar
3. APK prêt en 15-20 minutes

---

**🎯 Votre app AlertHeure est 100% prête pour la génération d'APK !**