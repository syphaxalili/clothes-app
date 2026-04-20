# Smart Wardrobe Assistant ðŸ‘”

Une application mobile intelligente qui vous aide Ã  choisir vos tenues en fonction de la mÃ©tÃ©o grÃ¢ce Ã  l'IA.

## ðŸš€ FonctionnalitÃ©s

- **Authentification sÃ©curisÃ©e** : Inscription et connexion avec JWT
- **Gestion d'armoire** : Ajoutez, visualisez et supprimez vos vÃªtements
- **Suggestions IA** : Obtenez des recommandations de tenues basÃ©es sur :
  - La mÃ©tÃ©o actuelle (tempÃ©rature, pluie)
  - Vos prÃ©fÃ©rences de style
  - La compatibilitÃ© des couleurs et styles
- **Interface moderne** : Design Ã©purÃ© et intuitif

## ðŸ“‹ PrÃ©requis

- Node.js (v14 ou supÃ©rieur)
- MongoDB (local ou Atlas)
- Expo CLI : `npm install -g expo-cli`
- Un smartphone avec Expo Go ou un Ã©mulateur

## ðŸ› ï¸ Installation

### 1. Backend

```bash
cd backend
npm install
```

CrÃ©ez un fichier `.env` basÃ© sur `.env.example` :

```env
MONGODB_URI=mongodb://localhost:27017/smart-wardrobe
JWT_SECRET=votre_secret_jwt_super_securise
PORT=3000
GEMINI_API_KEY=votre_cle_api_gemini
```

**Obtenir une clÃ© API Gemini** :
1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. CrÃ©ez une nouvelle clÃ© API
3. Copiez-la dans votre fichier `.env`

DÃ©marrez le serveur :

```bash
npm run dev
```

### 2. Frontend

```bash
cd ..
npm install
```

CrÃ©ez un fichier `.env` basÃ© sur `.env.example` :

```env
API_URL=http://192.168.1.100:3000/api
```

**Important** : Remplacez `192.168.1.100` par l'adresse IP locale de votre machine :
- Windows : `ipconfig` (cherchez "Adresse IPv4")
- Mac/Linux : `ifconfig` ou `ip addr`

DÃ©marrez l'application :

```bash
npm start
```

Scannez le QR code avec Expo Go sur votre smartphone.

## ðŸ“± Utilisation

### 1. CrÃ©er un compte
- Ouvrez l'application
- Cliquez sur "Sign up"
- Remplissez vos informations

### 2. Ajouter des vÃªtements
- Allez dans l'onglet "Wardrobe"
- Cliquez sur le bouton "+"
- Remplissez les informations :
  - **Nom** : ex. "Pull en laine bleu"
  - **Type** : top, bottom, shoes, outerwear, accessory
  - **Style** : casual, formal, sport, etc.
  - **Couleur** : bleu, noir, rouge, etc.
  - **TempÃ©rature min/max** : plage de tempÃ©rature adaptÃ©e (en Â°C)
  - **Waterproof** : cochez si impermÃ©able

### 3. Obtenir une suggestion
- Allez dans l'onglet "Home"
- Cliquez sur "Get Outfit Suggestion"
- Autorisez l'accÃ¨s Ã  votre localisation
- L'IA vous proposera une tenue complÃ¨te adaptÃ©e Ã  la mÃ©tÃ©o

## ðŸ—ï¸ Architecture

### Backend (Node.js + Express)

```
backend/
â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ User.js          # ModÃ¨le utilisateur
â”‚   â””â”€â”€ Clothing.js      # ModÃ¨le vÃªtement
â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ auth.js          # Routes d'authentification
â”‚   â”œâ”€â”€ clothing.js      # CRUD vÃªtements
â”‚   â””â”€â”€ outfit.js        # Suggestions IA
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ weatherService.js # API Open-Meteo
â”‚   â””â”€â”€ aiService.js      # API Gemini
â”œâ”€â”€ middleware/
â”‚   â””â”€â”€ auth.js          # Middleware JWT
â””â”€â”€ server.js            # Point d'entrÃ©e
```

### Frontend (React Native + Expo)

```
src/
â”œâ”€â”€ context/
â”‚   â””â”€â”€ AuthContext.js   # Gestion authentification
â”œâ”€â”€ navigation/
â”‚   â””â”€â”€ AppNavigator.js  # Navigation Stack/Tabs
â”œâ”€â”€ screens/
â”‚   â”œâ”€â”€ LoginScreen.js
â”‚   â”œâ”€â”€ RegisterScreen.js
â”‚   â”œâ”€â”€ HomeScreen.js
â”‚   â”œâ”€â”€ WardrobeScreen.js
â”‚   â”œâ”€â”€ AddClothingScreen.js
â”‚   â””â”€â”€ ResultScreen.js
â””â”€â”€ services/
    â””â”€â”€ api.js           # Client API Axios
```

## ðŸ”’ SÃ©curitÃ©

- âœ… Mots de passe hashÃ©s avec bcrypt
- âœ… Authentification JWT
- âœ… Variables d'environnement pour les secrets
- âœ… Validation des donnÃ©es cÃ´tÃ© serveur
- âœ… Middleware d'authentification

## ðŸŒ APIs UtilisÃ©es

- **Open-Meteo** : DonnÃ©es mÃ©tÃ©o gratuites (pas de clÃ© API requise)
- **Google Gemini** : IA gÃ©nÃ©rative pour les suggestions de tenues

## ðŸ“Š SchÃ©ma de donnÃ©es

### Clothing (VÃªtement)

```javascript
{
  name: String,              // "Pull en laine bleu"
  type: String,              // "top", "bottom", "shoes", "outerwear", "accessory"
  style: String,             // "casual", "formal", "sport"
  color: String,             // "bleu", "noir", "rouge"
  isWaterproof: Boolean,     // true/false
  temperatureMin: Number,    // -10
  temperatureMax: Number,    // 15
  userId: ObjectId           // RÃ©fÃ©rence utilisateur
}
```

## ðŸŽ¨ Design

- Interface moderne et Ã©purÃ©e
- Palette de couleurs cohÃ©rente
- IcÃ´nes emoji pour une meilleure UX
- Animations fluides
- Design responsive

## ðŸ› DÃ©pannage

### Le backend ne dÃ©marre pas
- VÃ©rifiez que MongoDB est en cours d'exÃ©cution
- VÃ©rifiez les variables d'environnement dans `.env`

### L'app ne se connecte pas au backend
- VÃ©rifiez que l'URL dans `.env` utilise votre IP locale (pas localhost)
- VÃ©rifiez que le backend est dÃ©marrÃ©
- VÃ©rifiez que vous Ãªtes sur le mÃªme rÃ©seau WiFi

### Erreur de localisation
- Autorisez l'accÃ¨s Ã  la localisation dans les paramÃ¨tres de votre tÃ©lÃ©phone
- RedÃ©marrez l'application

## ðŸ“ Licence

MIT

## Repartition des responsabilites

### Evans

- Integration de l'API meteo
- Recuperation des donnees de temperature et de pluie
- Participation a la logique d'adaptation des tenues selon la meteo

### Syphax

- Lead du projet
- Integration de l'API Gemini
- Generation des suggestions d'outfit

### Yannis

- Developpement de la partie front-end
- Mise en place des ecrans de l'application mobile
- Participation a l'interface utilisateur et a la navigation

### Fatma

- Mise en place de l'authentification
- Gestion de la garde-robe
- Participation aux fonctionnalites utilisateur liees aux vetements

### Mohamed

- Integration de la base de donnees
- Configuration de la base de donnees
- Participation a la mise en place de la persistence des donnees

### Mohammed

- Integration de la base de donnees
- Configuration de la base de donnees
- Participation a la mise en place de la persistence des donnees

## ðŸ‘¨â€ðŸ’» Auteur

DÃ©veloppÃ© avec â¤ï¸ pour le projet IPSSI MIA
