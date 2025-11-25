const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateMatch } = require('../middlewares/validation');



// GET /api/matches - Liste tous les matches
router.get('/', matchController.getAllMatches);

// GET /api/matches/upcoming - Matches à venir
router.get('/upcoming', matchController.getUpcomingMatches);

// GET /api/matches/:id - Détails d'un match
router.get('/:id', matchController.getMatchById);



// POST /api/matches - Créer un match
router.post(
  '/',
  authMiddleware,
  validateMatch,
  matchController.createMatch
);

// PUT /api/matches/:id - Modifier un match
router.put(
  '/:id',
  authMiddleware,
  validateMatch,
  matchController.updateMatch
);

// DELETE /api/matches/:id - Supprimer un match
router.delete(
  '/:id',
  authMiddleware,
  matchController.deleteMatch
);

module.exports = router;