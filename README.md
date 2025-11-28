# 🏆 API Backend - Coupe d'Afrique des Nations (CAN) 2025/2026

API REST complète pour la gestion du tournoi de la CAN, développée avec Node.js, Express et PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![Express](https://img.shields.io/badge/Express-v4.18+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table des Matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Documentation API](#-documentation-api)
- [Structure du Projet](#-structure-du-projet)
- [Équipe](#-équipe)
- [License](#-license)

---

## 🎯 Présentation

Cette API permet de gérer l'ensemble des données du tournoi de la Coupe d'Afrique des Nations :
- **24 équipes nationales** participantes
- **Gestion des joueurs** et compositions d'équipes
- **Calendrier des matches** avec résultats en temps réel
- **Système d'authentification** sécurisé pour les administrateurs
- **Documentation complète** avec Postman

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Tokens JWT avec expiration
- Hashage des mots de passe (Bcrypt)
- Rôles utilisateurs (admin/user)

### ⚽ Gestion des Équipes
- CRUD complet des équipes
- Informations détaillées (pays, coach, groupe)
- Liste des joueurs par équipe

### 👤 Gestion des Joueurs
- CRUD complet des joueurs
- Positions, numéros, âges
- Association aux équipes

### 🏟️ Gestion des Matches
- CRUD complet des matches
- Statuts : scheduled, live, finished
- Scores en temps réel
- Matches à venir
- Informations des stades

---

## 🛠️ Technologies

### Backend
- **Node.js** v18+
- **Express.js** v4.18+
- **PostgreSQL** v14+
- **Sequelize ORM** v6.35+

### Sécurité
- **JWT** (JSON Web Tokens)
- **Bcrypt** (hashage de mots de passe)
- **CORS** (Cross-Origin Resource Sharing)

### Outils
- **Dotenv** (variables d'environnement)
- **Express Validator** (validation des données)
- **Postman** (documentation et tests)

---

## 🚀 Installation

### Prérequis
- Node.js v18 ou supérieur
- PostgreSQL v14 ou supérieur
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votre-equipe/can-api-2025.git
cd can-api-2025
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer la base de données PostgreSQL**
```sql
CREATE DATABASE can_2025;
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

5. **Exécuter les migrations**
```bash
npm run migrate
```

6. **Seeder la base (optionnel)**
```bash
npm run seed
```

7. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

---

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=can_2025
DB_USER=postgres
DB_PASSWORD=votre_password

# JWT
JWT_SECRET=votre_secret_key_super_securisee
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 📖 Utilisation

### Démarrage rapide

1. **Créer un compte admin**
```bash
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@can2025.com",
  "password": "Admin@2025",
  "role": "admin"
}
```

2. **Se connecter**
```bash
POST /api/auth/login
{
  "email": "admin@can2025.com",
  "password": "Admin@2025"
}
```

3. **Utiliser le token JWT**
```bash
Authorization: Bearer <votre_token_jwt>
```

---

## 📡 Documentation API

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentification

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "user"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Profil utilisateur 🔒
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### ⚽ Équipes

#### Lister toutes les équipes
```http
GET /api/teams
```

#### Obtenir une équipe
```http
GET /api/teams/:id
```

#### Créer une équipe 🔒 (Admin)
```http
POST /api/teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sénégal",
  "country": "Sénégal",
  "flag_url": "https://example.com/flags/senegal.png",
  "coach": "Aliou Cissé",
  "group": "A"
}
```

#### Modifier une équipe 🔒 (Admin)
```http
PUT /api/teams/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "coach": "Nouveau coach"
}
```

#### Supprimer une équipe 🔒 (Admin)
```http
DELETE /api/teams/:id
Authorization: Bearer <token>
```

---

### 👤 Joueurs

#### Lister tous les joueurs
```http
GET /api/players
```

#### Joueurs d'une équipe
```http
GET /api/players/team/:teamId
```

#### Obtenir un joueur
```http
GET /api/players/:id
```

#### Créer un joueur 🔒 (Admin)
```http
POST /api/players
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sadio Mané",
  "position": "Attaquant",
  "number": 10,
  "age": 31,
  "team_id": 1
}
```

#### Modifier un joueur 🔒 (Admin)
```http
PUT /api/players/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "number": 11
}
```

#### Supprimer un joueur 🔒 (Admin)
```http
DELETE /api/players/:id
Authorization: Bearer <token>
```

---

### 🏟️ Matches

#### Lister tous les matches
```http
GET /api/matches
```

#### Matches à venir
```http
GET /api/matches/upcoming
```

#### Obtenir un match
```http
GET /api/matches/:id
```

#### Créer un match 🔒 (Admin)
```http
POST /api/matches
Authorization: Bearer <token>
Content-Type: application/json

{
  "teamhomeid": 1,
  "teamawayid": 2,
  "match_date": "2025-06-15T20:00:00Z",
  "stadium": "Stade Mohammed V",
  "status": "scheduled",
  "score_home": 0,
  "score_away": 0
}
```

#### Modifier un match 🔒 (Admin)
```http
PUT /api/matches/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "score_home": 2,
  "score_away": 1,
  "status": "finished"
}
```

#### Supprimer un match 🔒 (Admin)
```http
DELETE /api/matches/:id
Authorization: Bearer <token>
```

---

## 🗂️ Structure du Projet

```
can-api-2025/
├── src/
│   ├── config/
│   │   └── database.js          # Configuration PostgreSQL
│   ├── models/
│   │   ├── User.js              # Modèle utilisateur
│   │   ├── Team.js              # Modèle équipe
│   │   ├── Player.js            # Modèle joueur
│   │   ├── Match.js             # Modèle match
│   │   └── index.js             # Export et associations
│   ├── controllers/
│   │   ├── authController.js    # Logique authentification
│   │   ├── teamController.js    # Logique équipes
│   │   ├── playerController.js  # Logique joueurs
│   │   └── matchController.js   # Logique matches
│   ├── routes/
│   │   ├── authRoutes.js        # Routes auth
│   │   ├── teamRoutes.js        # Routes teams
│   │   ├── playerRoutes.js      # Routes players
│   │   └── matchRoutes.js       # Routes matches
│   ├── middlewares/
│   │   ├── authMiddleware.js    # Vérification JWT
│   │   ├── roleMiddleware.js    # Vérification rôles
│   │   └── errorHandler.js      # Gestion erreurs globales
│   ├── validators/
│   │   ├── authValidator.js     # Validation auth
│   │   ├── teamValidator.js     # Validation teams
│   │   ├── playerValidator.js   # Validation players
│   │   └── matchValidator.js    # Validation matches
│   └── server.js                # Point d'entrée
├── migrations/                  # Migrations Sequelize
├── seeders/                     # Données de test
├── .env.example                 # Template variables d'env
├── .gitignore
├── package.json
└── README.md
```

---

## 👥 Équipe de Développement

Ce projet a été réalisé par une équipe de 4 développeurs backend :

| Rôle | Responsabilités |
|------|----------------|
| **Développeur 1** | Architecture & Base de Données (UML, PostgreSQL, Migrations) |
| **Développeur 2** | Authentification & Sécurité (JWT, Bcrypt, Middlewares) |
| **Développeur 3** | API CRUD Teams & Players |
| **Développeur 4** | CRUD Matches & Documentation |

---

## 📝 Scripts disponibles

```bash
# Démarrage
npm start              # Production
npm run dev            # Développement (nodemon)

# Base de données
npm run migrate        # Exécuter les migrations
npm run migrate:undo   # Annuler la dernière migration
npm run seed           # Remplir avec des données de test

# Tests
npm test               # Lancer les tests
npm run test:watch     # Tests en mode watch
```

---

## 🔒 Sécurité

- ✅ Mots de passe hashés avec Bcrypt (salt rounds: 10)
- ✅ Tokens JWT avec expiration configurable
- ✅ Validation des entrées avec Express Validator
- ✅ Protection CORS configurée
- ✅ Variables d'environnement sécurisées
- ✅ Middleware d'authentification sur routes sensibles
- ✅ Vérification des rôles utilisateurs

---

## 📊 Base de Données

### Modèle Entité-Relation (ERD)

```
Users (1) ──────┐
                │
Teams (1) ──────┼──── (*) Players
  │             │
  │             │
  ├─── Home ────┤
  │             │
  └─── Away ────┘
        │
    Matches (*)
```

### Relations
- **Users** : Gestion des administrateurs
- **Teams** ↔ **Players** : One-to-Many
- **Teams** ↔ **Matches** : Many-to-Many (home/away)

---

## 🌐 Déploiement

### Render (Recommandé)

1. Créer un compte sur [Render](https://render.com)
2. Créer une PostgreSQL Database
3. Créer un Web Service
4. Connecter le repository GitHub
5. Configurer les variables d'environnement
6. Déployer !

### Autres options
- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS**

---

## 📚 Ressources Utiles

- [Documentation Express.js](https://expressjs.com/)
- [Documentation Sequelize](https://sequelize.org/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Collection Postman](./postman/CAN_API_2025.postman_collection.json)

---

## 🐛 Résolution de Problèmes

### Erreur de connexion PostgreSQL
```bash
# Vérifier que PostgreSQL est lancé
sudo service postgresql status

# Vérifier les credentials dans .env
DB_USER=postgres
DB_PASSWORD=votre_password
```

### Erreur JWT
```bash
# Vérifier que JWT_SECRET est défini dans .env
JWT_SECRET=une_cle_secrete_longue_et_complexe
```

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

<div align="center">

**⚽ Fait avec ❤️ pour la CAN 2025/2026 🏆**

</div>