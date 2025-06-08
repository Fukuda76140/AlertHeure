#!/bin/bash

echo "🚀 Script de génération APK AlertHeure"
echo "======================================"

# Configuration des variables d'environnement
export ANDROID_HOME=$(pwd)/android/android-sdk-tools
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/35.0.0

echo "📱 Configuration Android:"
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

# Vérification du SDK
if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ Erreur: SDK Android non trouvé"
    echo "💡 Exécutez d'abord l'installation du SDK"
    exit 1
fi

# Nettoyage
echo "🧹 Nettoyage des builds précédents..."
cd android
./gradlew clean --no-daemon --quiet

# Génération de l'APK
echo "🔨 Génération de l'APK en cours..."
./gradlew assembleDebug --no-daemon

# Vérification du résultat
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "✅ APK généré avec succès !"
    echo "📦 Emplacement: $(pwd)/$APK_PATH"
    echo "📊 Taille: $(du -h "$APK_PATH" | cut -f1)"
    echo ""
    echo "🎯 Installation sur un appareil connecté:"
    echo "   adb install $APK_PATH"
    echo ""
    echo "📱 Ou transférez le fichier sur votre téléphone Android"
else
    echo ""
    echo "❌ Erreur: APK non généré"
    echo "💡 Vérifiez les logs ci-dessus pour plus d'informations"
    exit 1
fi