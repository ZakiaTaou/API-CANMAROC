import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateTeam } from '../middlewares/validation.js';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js';

const router = express.Router();

// GET /api/teams - Liste toutes les équipes
router.get('/', getAllTeams);

// GET /api/teams/:id - Détails d'une équipe
router.get('/:id', getTeamById);

// POST /api/teams - Créer une équipe (protégé)
router.post('/', authenticateToken, validateTeam, createTeam);

// PUT /api/teams/:id - Modifier une équipe (protégé)
router.put('/:id', authenticateToken, validateTeam, updateTeam);

// DELETE /api/teams/:id - Supprimer une équipe (protégé)
router.delete('/:id', authenticateToken, deleteTeam);

export default router;