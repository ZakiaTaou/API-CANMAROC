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