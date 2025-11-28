import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  getAllMatches,
  getUpcomingMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.get("/", getAllMatches);
router.get("/upcoming", getUpcomingMatches);
router.get("/:id", getMatchById);

// Routes protégées (Admin uniquement)
router.post('/', authenticateToken, createMatch);
router.put('/:id', authenticateToken, updateMatch);
router.delete('/:id', authenticateToken, deleteMatch);

export default router;
