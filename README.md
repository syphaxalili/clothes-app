# Smart Wardrobe Assistant 👔

Une application mobile intelligente qui vous aide à choisir vos tenues en fonction de la météo grâce à l'IA.

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Inscription et connexion avec JWT
- **Gestion d'armoire** : Ajoutez, visualisez et supprimez vos vêtements
- **Suggestions IA** : Obtenez des recommandations de tenues basées sur :
  - La météo actuelle (température, pluie)
  - Vos préférences de style
  - La compatibilité des couleurs et styles
- **Interface moderne** : Design épuré et intuitif

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- Expo CLI : `npm install -g expo-cli`
- Un smartphone avec Expo Go ou un émulateur

## 🛠️ Installation

### 1. Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` basé sur `.env.example` :

```env
MONGODB_URI=mongodb://localhost:27017/smart-wardrobe
JWT_SECRET=votre_secret_jwt_super_securise
PORT=3000
GEMINI_API_KEY=votre_cle_api_gemini
```

**Obtenir une clé API Gemini** :
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une nouvelle clé API
3. Copiez-la dans votre fichier `.env`

Démarrez le serveur :

```bash
npm run dev
```

### 2. Frontend

```bash
cd ..
npm install
```

Créez un fichier `.env` basé sur `.env.example` :

```env
API_URL=http://192.168.1.100:3000/api
```

**Important** : Remplacez `192.168.1.100` par l'adresse IP locale de votre machine :
- Windows : `ipconfig` (cherchez "Adresse IPv4")
- Mac/Linux : `ifconfig` ou `ip addr`

Démarrez l'application :

```bash
npm start
```

Scannez le QR code avec Expo Go sur votre smartphone.

## 📱 Utilisation

### 1. Créer un compte
- Ouvrez l'application
- Cliquez sur "Sign up"
- Remplissez vos informations

### 2. Ajouter des vêtements
- Allez dans l'onglet "Wardrobe"
- Cliquez sur le bouton "+"
- Remplissez les informations :
  - **Nom** : ex. "Pull en laine bleu"
  - **Type** : top, bottom, shoes, outerwear, accessory
  - **Style** : casual, formal, sport, etc.
  - **Couleur** : bleu, noir, rouge, etc.
  - **Température min/max** : plage de température adaptée (en °C)
  - **Waterproof** : cochez si imperméable

### 3. Obtenir une suggestion
- Allez dans l'onglet "Home"
- Cliquez sur "Get Outfit Suggestion"
- Autorisez l'accès à votre localisation
- L'IA vous proposera une tenue complète adaptée à la météo

## 🏗️ Architecture

### Backend (Node.js + Express)

```text
backend/
├── models/
│   ├── User.js          # Modèle utilisateur
│   └── Clothing.js      # Modèle vêtement
├── routes/
│   ├── auth.js          # Routes d'authentification
│   ├── clothing.js      # CRUD vêtements
│   └── outfit.js        # Suggestions IA
├── services/
│   ├── weatherService.js # API Open-Meteo
│   └── aiService.js      # API Gemini
├── middleware/
│   └── auth.js          # Middleware JWT
└── server.js            # Point d'entrée
```

### Frontend (React Native + Expo)

```text
src/
├── context/
│   └── AuthContext.js   # Gestion authentification
├── navigation/
│   └── AppNavigator.js  # Navigation Stack/Tabs
├── screens/
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── WardrobeScreen.js
│   ├── AddClothingScreen.js
│   └── ResultScreen.js
└── services/
    └── api.js           # Client API Axios
```

## 🔒 Sécurité

- ✅ Mots de passe hashés avec bcrypt
- ✅ Authentification JWT
- ✅ Variables d'environnement pour les secrets
- ✅ Validation des données côté serveur
- ✅ Middleware d'authentification

## 🌐 APIs Utilisées

- **Open-Meteo** : Données météo gratuites (pas de clé API requise)
- **Google Gemini** : IA générative pour les suggestions de tenues

## 📊 Schéma de données

### Clothing (Vêtement)

```javascript
{
  name: String,              // "Pull en laine bleu"
  type: String,              // "top", "bottom", "shoes", "outerwear", "accessory"
  style: String,             // "casual", "formal", "sport"
  color: String,             // "bleu", "noir", "rouge"
  isWaterproof: Boolean,     // true/false
  temperatureMin: Number,    // -10
  temperatureMax: Number,    // 15
  userId: ObjectId           // Référence utilisateur
}
```

## 🎨 Design

- Interface moderne et épurée
- Palette de couleurs cohérente
- Icônes emoji pour une meilleure UX
- Animations fluides
- Design responsive

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez les variables d'environnement dans `.env`

### L'app ne se connecte pas au backend
- Vérifiez que l'URL dans `.env` utilise votre IP locale (pas localhost)
- Vérifiez que le backend est démarré
- Vérifiez que vous êtes sur le même réseau WiFi

### Erreur de localisation
- Autorisez l'accès à la localisation dans les paramètres de votre téléphone
- Redémarrez l'application

## Répartition des responsabilités

### Evans

- Intégration de l'API météo
- Récupération des données de température et de pluie
- Participation à la logique d'adaptation des tenues selon la météo

### Syphax

- Lead du projet
- Intégration de l'API Gemini
- Génération des suggestions d'outfit

### Yannis

- Développement de la partie front-end
- Mise en place des écrans de l'application mobile
- Participation à l'interface utilisateur et à la navigation

### Fatma

- Mise en place de l'authentification
- Gestion de la garde-robe
- Participation aux fonctionnalités utilisateur liées aux vêtements

### Mohamed

- Intégration de la base de données
- Configuration de la base de données
- Participation à la mise en place de la persistance des données

### Mohammed

- Intégration de la base de données
- Configuration de la base de données
- Participation à la mise en place de la persistance des données

## 📝 Licence

MIT

## 👨‍💻 Auteur

Développé avec ❤️ pour le projet IPSSI MIA
