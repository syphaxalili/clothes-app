# Guide d'Installation Complet - Smart Wardrobe Assistant

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (v14 ou supérieur)
   - Téléchargez depuis [nodejs.org](https://nodejs.org/)
   - Vérifiez : `node --version`

2. **MongoDB**
   - **Option 1 - Local** : [Télécharger MongoDB Community](https://www.mongodb.com/try/download/community)
   - **Option 2 - Cloud** : [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go** sur votre smartphone
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Installation Étape par Étape

### Étape 1 : Cloner/Télécharger le projet

Si vous avez déjà les fichiers, passez à l'étape 2.

### Étape 2 : Configurer MongoDB

#### Option A - MongoDB Local

1. Démarrez MongoDB :
   - **Windows** : MongoDB démarre automatiquement après l'installation
   - **Mac** : `brew services start mongodb-community`
   - **Linux** : `sudo systemctl start mongod`

2. Vérifiez que MongoDB fonctionne :
   ```bash
   mongosh
   ```

#### Option B - MongoDB Atlas (Cloud)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster (gratuit)
3. Créez un utilisateur de base de données
4. Autorisez votre IP (ou 0.0.0.0/0 pour tous)
5. Récupérez la chaîne de connexion (ex: `mongodb+srv://user:pass@cluster.mongodb.net/smart-wardrobe`)

### Étape 3 : Obtenir une clé API Gemini

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé générée

### Étape 4 : Configurer le Backend

1. Ouvrez un terminal et naviguez vers le dossier backend :
   ```bash
   cd backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez le fichier `.env` :
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

4. Éditez le fichier `.env` avec vos valeurs :
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart-wardrobe
   JWT_SECRET=mon_super_secret_jwt_tres_securise_123456
   PORT=3000
   GEMINI_API_KEY=votre_cle_api_gemini_ici
   ```

5. Démarrez le serveur :
   ```bash
   npm run dev
   ```

   Vous devriez voir :
   ```
   Server running on port 3000
   Connected to MongoDB
   ```

### Étape 5 : Configurer le Frontend

1. Ouvrez un **nouveau terminal** (gardez le backend en cours d'exécution)

2. Naviguez vers le dossier racine du projet :
   ```bash
   cd ..
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

4. Trouvez votre adresse IP locale :
   
   **Windows** :
   ```bash
   ipconfig
   ```
   Cherchez "Adresse IPv4" (ex: 192.168.1.100)
   
   **Mac** :
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
   **Linux** :
   ```bash
   ip addr show | grep "inet " | grep -v 127.0.0.1
   ```

5. Créez le fichier `.env` :
   ```bash
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

6. Éditez le fichier `.env` avec votre IP :
   ```env
   API_URL=http://192.168.1.100:3000/api
   ```
   ⚠️ Remplacez `192.168.1.100` par VOTRE adresse IP

7. Démarrez l'application :
   ```bash
   npm start
   ```

### Étape 6 : Tester l'application

1. Un QR code s'affiche dans le terminal
2. Ouvrez **Expo Go** sur votre smartphone
3. Scannez le QR code :
   - **iOS** : Utilisez l'appareil photo
   - **Android** : Utilisez le scanner dans Expo Go
4. L'application se charge sur votre téléphone

## ✅ Vérification de l'installation

### Backend fonctionne ?

Testez dans votre navigateur : `http://localhost:3000/api/health`

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "Smart Wardrobe API is running"
}
```

### Frontend fonctionne ?

L'application devrait s'ouvrir sur l'écran de connexion.

## 🎯 Premiers pas

1. **Créer un compte** :
   - Cliquez sur "Sign up"
   - Remplissez le formulaire
   - Vous êtes automatiquement connecté

2. **Ajouter des vêtements** :
   - Allez dans l'onglet "Wardrobe"
   - Cliquez sur le bouton "+"
   - Ajoutez quelques vêtements (minimum 3-4 pour de bonnes suggestions)

3. **Obtenir une suggestion** :
   - Retournez à l'onglet "Home"
   - Cliquez sur "Get Outfit Suggestion"
   - Autorisez l'accès à la localisation
   - Admirez votre tenue personnalisée ! 👔

## 🐛 Problèmes courants

### "Cannot connect to backend"

- ✅ Vérifiez que le backend est démarré (`npm run dev` dans le dossier backend)
- ✅ Vérifiez que l'URL dans `.env` utilise votre IP locale (pas localhost)
- ✅ Vérifiez que votre téléphone et ordinateur sont sur le même WiFi
- ✅ Désactivez temporairement le pare-feu

### "MongoDB connection error"

- ✅ Vérifiez que MongoDB est démarré
- ✅ Vérifiez l'URI dans `backend/.env`
- ✅ Si vous utilisez Atlas, vérifiez que votre IP est autorisée

### "Location permission denied"

- ✅ Allez dans les paramètres de votre téléphone
- ✅ Autorisez la localisation pour Expo Go
- ✅ Redémarrez l'application

### "AI suggestion failed"

- ✅ Vérifiez que votre clé API Gemini est correcte
- ✅ Vérifiez que vous avez des vêtements dans votre armoire
- ✅ Vérifiez que les vêtements ont des plages de température appropriées

### Le QR code ne s'affiche pas

- ✅ Appuyez sur `w` dans le terminal pour ouvrir dans le navigateur
- ✅ Ou tapez `expo start --tunnel` pour utiliser un tunnel

## 📱 Tester sur émulateur

### iOS Simulator (Mac uniquement)

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

## 🔧 Commandes utiles

### Backend
```bash
cd backend
npm run dev      # Mode développement
npm start        # Mode production
```

### Frontend
```bash
npm start        # Démarrer Expo
npm run android  # Ouvrir sur Android
npm run ios      # Ouvrir sur iOS
```

## 📚 Documentation supplémentaire

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [MongoDB](https://docs.mongodb.com/)
- [Express.js](https://expressjs.com/)

## 💡 Conseils

- Gardez toujours le backend en cours d'exécution pendant que vous utilisez l'app
- Ajoutez au moins 5-10 vêtements pour de meilleures suggestions
- Soyez précis avec les plages de température
- Utilisez des styles cohérents (casual, formal, sport, etc.)

## 🎉 Vous êtes prêt !

Votre Smart Wardrobe Assistant est maintenant opérationnel. Profitez de vos suggestions de tenues personnalisées ! 👔✨
