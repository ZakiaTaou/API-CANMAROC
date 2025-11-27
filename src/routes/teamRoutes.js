
import express from 'express';
import teamController from '../controllers/teamController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateTeam } from '../middlewares/validation.js';


const router = express.Router();

// GET /api/teams - Liste toutes les équipes
router.get('/', teamController.getAllTeams);

// GET /api/teams/:id - Détails d'une équipe
router.get('/:id', teamController.getTeamById);


// POST /api/teams - Créer une équipe
router.post(
  '/',
  authMiddleware,
  validateTeam,
  teamController.createTeam
);

// PUT /api/teams/:id - Modifier une équipe
router.put(
  '/:id',
  authMiddleware,
  validateTeam,
  teamController.updateTeam
);

// DELETE /api/teams/:id - Supprimer une équipe
router.delete(
  '/:id',
  authMiddleware,
  teamController.deleteTeam
);

export default router;