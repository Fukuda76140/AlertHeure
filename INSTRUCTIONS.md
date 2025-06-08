# AlertHeure - Application de Suivi d'Horaires

## Description
AlertHeure est une application React Native multiplateforme pour suivre les horaires de travail quotidiens avec notifications automatiques.

## Fonctionnalités

### ✅ Fonctionnalités Implémentées
- **Configuration flexible** : Choix entre 36h/semaine (7h12/jour) ou 39h/semaine (7h48/jour)
- **Pause déjeuner personnalisable** : Par défaut 30 minutes, modifiable
- **Timer en temps réel** : Suivi automatique du temps de travail
- **Notifications intelligentes** :
  - Fin de journée normale
  - Heures supplémentaires (après 15 minutes)
  - Limite d'heures sup (1h12 maximum)
- **Persistance des données** : Sauvegarde locale avec AsyncStorage
- **Gestion d'état** : Continue de compter même si l'app est fermée

### 📱 Utilisation
1. **Premier lancement** : Configurez votre type d'horaire et pause déjeuner
2. **Démarrage** : Appuyez sur "Commencer la journée"
3. **Suivi** : L'application affiche le temps effectué et restant
4. **Fin** : Appuyez sur "Terminer la journée" quand c'est fini
5. **Réinitialisation** : Possibilité de recommencer la journée si nécessaire

### 🔔 Notifications
- **Temps atteint** : Notification quand les heures normales sont effectuées
- **Heures supplémentaires** : Alerte après 15 minutes d'heures sup
- **Limite maximale** : Avertissement à 1h12 d'heures supplémentaires

## Installation et Test

### Prérequis
- Node.js
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS)

### Commandes de test
```bash
# Lancer sur Android
npx react-native run-android

# Lancer sur iOS
npx react-native run-ios

# Tester TypeScript
npx tsc --noEmit
```

### Structure du Code
```
src/
├── navigation/
│   └── AppNavigator.tsx      # Navigation entre écrans
├── screens/
│   ├── ConfigScreen.tsx      # Écran de configuration
│   └── TimerScreen.tsx       # Écran principal avec timer
├── services/
│   └── NotificationService.ts # Gestion des notifications
├── types/
│   └── index.ts              # Types TypeScript
└── utils/
    └── timeCalculations.ts   # Utilitaires de calcul de temps
```

## Améliorations Futures Possibles
- Historique des journées de travail
- Statistiques hebdomadaires/mensuelles
- Export des données
- Intégration calendrier
- Mode sombre
- Widget pour l'écran d'accueil
- Synchronisation cloud