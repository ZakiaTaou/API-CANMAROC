<<<<<<< HEAD
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
=======
import express from 'express';
import {
  getAllMatches,
  getUpcomingMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController';
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router();




// Routes publiques
router.get('/', getAllMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

// Routes protégées (Admin uniquement)
router.post('/', authMiddleware, createMatch);
router.put('/:id', authMiddleware, updateMatch);
router.delete('/:id', authMiddleware, deleteMatch);

export default router;
>>>>>>> 0ebda253ea66264337197e0607dfc35f2b0b753a
