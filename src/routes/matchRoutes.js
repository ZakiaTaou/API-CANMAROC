import express from 'express';
import {
  getAllMatches,
  getUpcomingMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController';
import { authenticate, isAdmin } from '../middlewares/auth'

const router = express.Router();

// Routes publiques
router.get('/', getAllMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id', getMatchById);

// Routes protégées (Admin uniquement)
router.post('/', authenticate, isAdmin, createMatch);
router.put('/:id', authenticate, isAdmin, updateMatch);
router.delete('/:id', authenticate, isAdmin, deleteMatch);

export default router;