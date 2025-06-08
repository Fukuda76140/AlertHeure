# 🌐 Génération APK en Ligne - AlertHeure

## 🚀 Services de Build Cloud Recommandés

### 1. **Expo Application Services (EAS)** ⭐ RECOMMANDÉ
Le plus simple et gratuit pour commencer :

```bash
# Installation
npm install -g @expo/cli eas-cli

# Configuration
npx install-expo-modules@latest
eas build:configure

# Build APK
eas build --platform android --profile development
```

**Avantages** :
- ✅ Gratuit (builds limités)
- ✅ Interface simple
- ✅ Compatible React Native
- ✅ APK téléchargeable directement

### 2. **GitHub Actions** (Automatique)
Build automatique lors du push :

```yaml
# .github/workflows/android-build.yml
name: Build Android APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'adopt'
        java-version: '11'
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
    - name: Install dependencies
      run: npm install
    - name: Build APK
      run: cd android && ./gradlew assembleDebug
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug.apk
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. **Bitrise** (Professionnel)
Service spécialisé mobile :
- Interface web intuitive
- 200 builds gratuits/mois
- Configuration via GUI

### 4. **CodeMagic** (Alternative)
- Build React Native natif
- Interface simple
- Plans gratuits disponibles

## 🎯 Solution Immédiate : Expo

### Étapes pour convertir en Expo :

1. **Installation d'Expo** :
```bash
cd AlertHeure
npx install-expo-modules@latest
```

2. **Configuration** :
```bash
npx create-expo-app --template blank-typescript AlertHeureExpo
# Copier nos fichiers src/ dans le nouveau projet
```

3. **Build en ligne** :
```bash
eas build --platform android
```

4. **Téléchargement APK** : L'APK sera disponible via lien web

## 📱 Alternative Rapide : APK Builder Online

### Services web directe :
- **ApkOnline.com** : Upload du code source
- **Buildfire.com** : Interface no-code
- **Phonegap Build** : Service Adobe (déprécié mais alternatives existent)

## 🔧 Solution Locale Alternative

Si vous avez Docker :
```bash
# Utiliser une image Android prête
docker run --rm -v $(pwd):/app -w /app reactnativecommunity/react-native-android:latest gradle assembleDebug
```

## 🏆 Recommandation

**Pour AlertHeure, je recommande Expo EAS** :
1. Gratuit pour commencer
2. Build en ~5-10 minutes
3. APK prêt à télécharger
4. Compatible avec toutes nos fonctionnalités

Voulez-vous que je configure Expo pour générer l'APK ?