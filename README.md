🏆 CAN 2025/2026 — API Backend
API REST pour la gestion du tournoi de la Coupe d’Afrique des Nations
---

📌
 Description du Projet
Ce projet consiste à développer l’API backend officielle pour la Coupe d’Afrique des Nations (CAN) 2025/2026.
L’objectif est de fournir une API REST sécurisée, performante et professionnelle permettant de gérer :

Les équipes nationales
Les joueurs
Les matches et résultats
L’authentification et les rôles admin
La documentation API complète

Ce backend servira d’outil interne pour le comité d’organisation et pour les futures applications web/mobile du tournoi.

---

🚀
 Stack Technique
| Technologie | Rôle |
|------------|------|
| Node.js | Runtime JavaScript |
| Express.js | Framework backend |
| PostgreSQL | Base de données relationnelle |
| Sequelize | ORM pour gérer les modèles & migrations |
| JWT | Authentification |
| Bcrypt | Hashage des mots de passe |
| Dotenv | Variables d’environnement |
| CORS | Autorisation des accès externes |
| Postman | Tests & documentation |

---

🏗️
 Architecture du Projet (MVC)
 📂 src/
├── 📂
 config/ → Configuration DB, JWT...
├── 📂
 controllers/ → Logique métier
├── 📂
 models/ → Modèles Sequelize
├── 📂
 routes/ → Routes API
├── 📂
 middleware/ → Auth, rôles, validations
├── 📂
 utils/ → Fonctions utilitaires
└── server.js → Fichier principal
