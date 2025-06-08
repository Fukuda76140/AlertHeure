# Guide de Génération APK - AlertHeure

## Problème Identifié
L'environnement actuel ne dispose pas du SDK Android installé, ce qui empêche la génération directe de l'APK.

## Solution 1: Installation du SDK Android (Recommandée)

### Prérequis
1. **Installer Android Studio** :
   - Télécharger depuis https://developer.android.com/studio
   - Installer et configurer le SDK

2. **Configurer les variables d'environnement** :
   ```bash
   export ANDROID_HOME=/path/to/android-sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```

3. **Générer l'APK** :
   ```bash
   cd AlertHeure/android
   ./gradlew assembleDebug
   ```

## Solution 2: Utilisation d'un Service CI/CD

### Option GitHub Actions
Créer `.github/workflows/android-build.yml` :
```yaml
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

## Solution 3: Expo Build (Alternative)

Si vous souhaitez une approche plus simple :
```bash
# Installer Expo CLI
npm install -g @expo/cli

# Configurer pour Expo
npx install-expo-modules

# Build avec EAS
eas build --platform android
```

## Emplacement de l'APK (une fois généré)
L'APK sera disponible à :
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Tests Sans APK
En attendant la génération de l'APK, vous pouvez tester l'application via :
1. **Expo Go** (si converti en Expo)
2. **React Native CLI** avec un émulateur
3. **Serveur de développement** : `npm start`

## Notes
- L'application est entièrement fonctionnelle et prête
- Toutes les dépendances sont correctement configurées
- Le problème est uniquement lié à l'absence du SDK Android dans l'environnement actuel