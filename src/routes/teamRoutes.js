const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateTeam } = require('../middlewares/validation');



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

module.exports = router;