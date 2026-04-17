# Architecture Technique - Smart Wardrobe Assistant

## 🏗️ Vue d'ensemble

L'application suit une architecture client-serveur avec :
- **Frontend** : React Native (Expo)
- **Backend** : Node.js + Express
- **Base de données** : MongoDB
- **APIs externes** : Open-Meteo (météo) + Google Gemini (IA)

```
┌─────────────────┐
│  React Native   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐      ┌──────────────┐
│   Express API   │─────▶│   MongoDB    │
│   (Backend)     │      │  (Database)  │
└────────┬────────┘      └──────────────┘
         │
         ├─────▶ Open-Meteo API (Météo)
         └─────▶ Gemini API (IA)
```

## 📁 Structure des dossiers

### Backend (`/backend`)

```
backend/
├── models/
│   ├── User.js              # Schéma utilisateur (email, password, name)
│   └── Clothing.js          # Schéma vêtement (name, type, style, etc.)
│
├── routes/
│   ├── auth.js              # POST /register, /login
│   ├── clothing.js          # GET, POST, DELETE /clothing
│   └── outfit.js            # POST /outfit/suggest
│
├── services/
│   ├── weatherService.js    # Récupération météo Open-Meteo
│   └── aiService.js         # Génération suggestions Gemini
│
├── middleware/
│   └── auth.js              # Vérification JWT
│
├── server.js                # Point d'entrée Express
├── package.json
└── .env                     # Configuration (non versionné)
```

### Frontend (`/`)

```
src/
├── context/
│   └── AuthContext.js       # State global authentification
│
├── navigation/
│   └── AppNavigator.js      # Stack + Tab Navigation
│
├── screens/
│   ├── LoginScreen.js       # Écran connexion
│   ├── RegisterScreen.js    # Écran inscription
│   ├── HomeScreen.js        # Écran accueil
│   ├── WardrobeScreen.js    # Liste vêtements
│   ├── AddClothingScreen.js # Ajout vêtement
│   └── ResultScreen.js      # Affichage suggestion
│
└── services/
    └── api.js               # Client Axios + intercepteurs

App.js                       # Point d'entrée React Native
package.json
.env                         # Configuration (non versionné)
```

## 🔐 Flux d'authentification

```
1. User Register/Login
   ↓
2. Backend vérifie credentials
   ↓
3. Backend génère JWT token
   ↓
4. Frontend stocke token (AsyncStorage)
   ↓
5. Frontend ajoute token à chaque requête (Axios interceptor)
   ↓
6. Backend vérifie token (middleware auth)
```

### Implémentation

**Backend - Génération JWT** :
```javascript
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: '30d'
});
```

**Frontend - Stockage** :
```javascript
await AsyncStorage.setItem('token', token);
```

**Frontend - Intercepteur** :
```javascript
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 👔 Flux CRUD Vêtements

### Création
```
AddClothingScreen
   ↓ POST /api/clothing
Backend valide données
   ↓
Sauvegarde MongoDB
   ↓
Retour 201 + objet créé
   ↓
Frontend refresh liste
```

### Lecture
```
WardrobeScreen
   ↓ GET /api/clothing
Backend filtre par userId
   ↓
Retour liste vêtements
   ↓
Frontend affiche FlatList
```

### Suppression
```
User clique 🗑️
   ↓ DELETE /api/clothing/:id
Backend vérifie ownership
   ↓
Supprime de MongoDB
   ↓
Frontend met à jour state local
```

## 🤖 Flux Suggestion IA

```
1. HomeScreen : User clique "Get Outfit Suggestion"
   ↓
2. Frontend demande permission localisation
   ↓
3. Frontend récupère coords GPS (latitude, longitude)
   ↓
4. POST /api/outfit/suggest { latitude, longitude }
   ↓
5. Backend → weatherService.getWeather(lat, lon)
   ↓
6. Open-Meteo API retourne { temperature, isRaining }
   ↓
7. Backend récupère tous les vêtements de l'user
   ↓
8. Backend FILTRE par température :
   clothing.temperatureMin <= temp <= clothing.temperatureMax
   ↓
9. Si pluie : priorise vêtements waterproof
   ↓
10. Backend → aiService.generateOutfit(filteredClothes, temp, rain)
    ↓
11. Gemini API reçoit prompt structuré avec liste vêtements
    ↓
12. Gemini retourne JSON :
    {
      "outfit": {
        "top": "id1",
        "bottom": "id2",
        "shoes": "id3",
        "outerwear": "id4",
        "accessories": ["id5"]
      },
      "explanation": "..."
    }
    ↓
13. Backend enrichit avec détails complets des vêtements
    ↓
14. Retour au Frontend
    ↓
15. Navigation vers ResultScreen
    ↓
16. Affichage tenue + explication
```

## 🧠 Logique de filtrage intelligent

### Pourquoi filtrer avant l'IA ?

1. **Optimisation tokens** : Envoyer seulement les vêtements pertinents
2. **Pertinence** : L'IA ne suggère que des vêtements adaptés
3. **Performance** : Moins de données = réponse plus rapide

### Algorithme de filtrage

```javascript
// 1. Filtrage par température
let filtered = allClothes.filter(item => 
  item.temperatureMin <= currentTemp && 
  item.temperatureMax >= currentTemp
);

// 2. Si pluie : prioriser waterproof pour outerwear et shoes
if (isRaining) {
  const waterproofItems = filtered.filter(item => item.isWaterproof);
  
  filtered = filtered.map(item => {
    if (item.type === 'outerwear' || item.type === 'shoes') {
      // Remplacer par version waterproof si disponible
      return waterproofItems.find(w => w.type === item.type) || item;
    }
    return item;
  });
}

// 3. Simplification pour l'IA (seulement champs nécessaires)
const forAI = filtered.map(item => ({
  id: item._id,
  name: item.name,
  type: item.type,
  style: item.style,
  color: item.color,
  isWaterproof: item.isWaterproof
}));
```

## 🔒 Sécurité

### Variables d'environnement

**Backend** (`backend/.env`) :
```env
MONGODB_URI=mongodb://...
JWT_SECRET=secret_key
GEMINI_API_KEY=api_key
```

**Frontend** (`.env`) :
```env
API_URL=http://192.168.1.100:3000/api
```

### Import sécurisé

```javascript
// ❌ JAMAIS COMME ÇA
const API_KEY = "sk-abc123...";

// ✅ TOUJOURS COMME ÇA
import { GEMINI_API_KEY } from '@env';
```

### Protection des routes

```javascript
// Middleware appliqué sur toutes les routes protégées
router.use(authMiddleware);

// Vérifie ownership avant suppression
const clothing = await Clothing.findOneAndDelete({
  _id: req.params.id,
  userId: req.userId  // ← Important !
});
```

## 📊 Schémas de données

### User
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (hashed bcrypt),
  name: String,
  createdAt: Date
}
```

### Clothing
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  type: Enum['top', 'bottom', 'shoes', 'outerwear', 'accessory'],
  style: String,
  color: String,
  isWaterproof: Boolean,
  temperatureMin: Number,
  temperatureMax: Number,
  createdAt: Date
}
```

## 🎨 Navigation Structure

```
AuthContext Provider
  └─ NavigationContainer
      ├─ [Non authentifié]
      │   └─ Stack Navigator
      │       ├─ LoginScreen
      │       └─ RegisterScreen
      │
      └─ [Authentifié]
          └─ Stack Navigator
              ├─ Tab Navigator
              │   ├─ HomeScreen
              │   └─ Wardrobe Stack
              │       ├─ WardrobeScreen
              │       └─ AddClothingScreen
              │
              └─ ResultScreen (Modal)
```

## 🌐 APIs Externes

### Open-Meteo (Météo)

**Endpoint** : `https://api.open-meteo.com/v1/forecast`

**Paramètres** :
- `latitude` : Latitude GPS
- `longitude` : Longitude GPS
- `current` : `temperature_2m,precipitation,rain`

**Réponse** :
```json
{
  "current": {
    "temperature_2m": 15.2,
    "precipitation": 0.0,
    "rain": 0.0
  }
}
```

**Avantages** :
- ✅ Gratuit, pas de clé API
- ✅ Données précises
- ✅ Pas de limite de requêtes

### Google Gemini (IA)

**Modèle** : `gemini-pro`

**Prompt système** :
```
You are a professional fashion stylist AI.
STRICT RULES:
1. Use ONLY provided clothing IDs
2. Create complete outfit (top, bottom, shoes, optional outerwear/accessories)
3. Return ONLY valid JSON

Current weather: 15°C, Dry
Available clothing: [...]
```

**Réponse attendue** :
```json
{
  "outfit": {
    "top": "clothing_id_1",
    "bottom": "clothing_id_2",
    "shoes": "clothing_id_3",
    "outerwear": null,
    "accessories": []
  },
  "explanation": "This outfit is perfect for..."
}
```

## 🚀 Performance

### Optimisations

1. **AsyncStorage** : Cache local pour token et user
2. **Filtrage côté serveur** : Réduit payload réseau
3. **Lazy loading** : Screens chargés à la demande
4. **Pull to refresh** : Actualisation manuelle des données
5. **Axios interceptors** : Gestion centralisée auth

### Gestion d'erreurs

```javascript
try {
  const response = await api.get('/clothing');
  setClothes(response.data);
} catch (error) {
  Alert.alert(
    'Error',
    error.response?.data?.error || 'Failed to load wardrobe'
  );
}
```

## 📱 Responsive Design

- Utilisation de `StyleSheet` React Native
- Dimensions relatives (flex, %)
- SafeAreaView pour notch/barre système
- KeyboardAvoidingView pour formulaires

## 🧪 Points d'extension

### Futures fonctionnalités possibles

1. **Upload photos** : Ajouter images des vêtements
2. **Favoris** : Sauvegarder tenues préférées
3. **Historique** : Voir suggestions passées
4. **Partage** : Partager tenues sur réseaux sociaux
5. **Notifications** : Rappels quotidiens
6. **Multi-langues** : i18n
7. **Mode sombre** : Dark theme
8. **Analytics** : Statistiques d'utilisation

## 📝 Bonnes pratiques appliquées

✅ Séparation concerns (MVC-like)
✅ Variables d'environnement pour secrets
✅ Validation données côté serveur
✅ Gestion erreurs cohérente
✅ Code modulaire et réutilisable
✅ Commentaires sur logique complexe
✅ Nommage explicite
✅ Pas de code dupliqué
✅ Sécurité first (JWT, bcrypt, ownership checks)
