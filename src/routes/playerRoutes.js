import express from 'express';
import playerController from '../controllers/playerController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validatePlayer } from '../middlewares/validation.js';


const router = express.Router();

// GET /api/players - Liste tous les joueurs
router.get('/', playerController.getAllPlayers);

// GET /api/players/team/:teamId - Joueurs d'une équipe spécifique
router.get('/team/:teamId', playerController.getPlayersByTeam);

// GET /api/players/:id - Détails d'un joueur
router.get('/:id', playerController.getPlayerById);



// POST /api/players - Créer un joueur
router.post(
  '/',
  authMiddleware,
  validatePlayer,
  playerController.createPlayer
);

// PUT /api/players/:id - Modifier un joueur
router.put(
  '/:id',
  authMiddleware,
  validatePlayer,
  playerController.updatePlayer
);

// DELETE /api/players/:id - Supprimer un joueur
router.delete(
  '/:id',
  authMiddleware,
  playerController.deletePlayer
);

export default router;