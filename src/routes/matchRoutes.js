// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getUpcomingMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/matchController');

// Importer les middlewares d'authentification (fournis par Dev 2)
const { authenticate, isAdmin } = require('../middlewares/auth');

// Routes publiques
router.get('/', getAllMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

// Routes protégées (Admin uniquement)
router.post('/', authenticate, isAdmin, createMatch);
router.put('/:id', authenticate, isAdmin, updateMatch);
router.delete('/:id', authenticate, isAdmin, deleteMatch);

module.exports = router;