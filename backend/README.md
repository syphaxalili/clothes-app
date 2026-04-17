# Smart Wardrobe Backend API

API REST pour l'application Smart Wardrobe Assistant.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du dossier backend :

```env
MONGODB_URI=mongodb://localhost:27017/smart-wardrobe
JWT_SECRET=votre_secret_jwt_super_securise
PORT=3000
GEMINI_API_KEY=votre_cle_api_gemini
```

## Démarrage

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Endpoints API

### Authentication

**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Clothing (Nécessite authentification)

**GET** `/api/clothing`
- Récupère tous les vêtements de l'utilisateur

**POST** `/api/clothing`
```json
{
  "name": "Pull en laine bleu",
  "type": "top",
  "style": "casual",
  "color": "bleu",
  "isWaterproof": false,
  "temperatureMin": 5,
  "temperatureMax": 15
}
```

**DELETE** `/api/clothing/:id`
- Supprime un vêtement

### Outfit (Nécessite authentification)

**POST** `/api/outfit/suggest`
```json
{
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

## Structure

```
backend/
├── models/          # Modèles Mongoose
├── routes/          # Routes Express
├── services/        # Services (Weather, AI)
├── middleware/      # Middleware d'authentification
└── server.js        # Point d'entrée
```

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Variables d'environnement pour les secrets
- Validation des données
