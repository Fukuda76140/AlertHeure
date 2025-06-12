# 📤 Instructions d'Upload Rapide

## 🚀 Méthode 1: Upload Direct (RECOMMANDÉ)

### Étapes simples :
1. **Zipper le projet** :
   - Sélectionnez tous les fichiers du dossier AlertHeure
   - **EXCLUEZ** : `node_modules/`, `android/android-sdk-tools/`, `android/.gradle/`
   - Créez un ZIP nommé `AlertHeure-source.zip`

2. **Upload sur GitHub** :
   - Allez sur https://github.com/Fukuda76140/AlertHeure
   - Cliquez "uploading an existing file"
   - Drag & drop votre ZIP ou sélectionnez-le
   - Commit message : "AlertHeure app complete"
   - Cliquez "Commit changes"

3. **GitHub Actions se lance automatiquement** !

## 🔥 Méthode 2: Git Command Line

Si vous avez Git configuré avec vos credentials :
```bash
git remote set-url origin https://VOTRE-TOKEN@github.com/Fukuda76140/AlertHeure.git
git push -u origin main
```

## ⚡ Méthode 3: GitHub CLI

Si vous avez GitHub CLI installé :
```bash
gh repo clone Fukuda76140/AlertHeure temp-repo
cp -r src/ android/ package.json App.tsx .github/ temp-repo/
cd temp-repo
git add .
git commit -m "AlertHeure complete app"
git push
```

## 📋 Files Importants à Inclure

**Essentiels pour le build :**
- ✅ `src/` (tout le code de l'app)
- ✅ `android/` (sauf android-sdk-tools et .gradle)
- ✅ `.github/workflows/build-android.yml`
- ✅ `package.json` et `package-lock.json`
- ✅ `App.tsx`
- ✅ `app.json`
- ✅ `babel.config.js`
- ✅ `metro.config.js`

**À EXCLURE :**
- ❌ `node_modules/`
- ❌ `android/android-sdk-tools/`
- ❌ `android/.gradle/`
- ❌ `android/app/build/`

## 🎯 Une fois uploadé

1. Allez dans l'onglet **"Actions"** de votre repo
2. Vous verrez "Build Android APK" en cours
3. Attendez 10-15 minutes
4. Téléchargez l'APK dans les artifacts !

---

**🚀 Le plus simple : Méthode 1 avec ZIP upload direct !**