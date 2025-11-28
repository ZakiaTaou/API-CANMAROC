import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validatePlayer } from "../middlewares/validation.js";
import {
  getAllPlayers,
  getPlayersByTeam,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js";

const router = express.Router();

// GET /api/players - Liste tous les joueurs
router.get("/", getAllPlayers);

// GET /api/players/team/:teamId - Joueurs d'une équipe spécifique
router.get("/team/:teamId", getPlayersByTeam);

// GET /api/players/:id - Détails d'un joueur
router.get("/:id", getPlayerById);

// POST /api/players - Créer un joueur
router.post("/", authenticateToken, validatePlayer, createPlayer);

// PUT /api/players/:id - Modifier un joueur
router.put("/:id", authenticateToken, validatePlayer, updatePlayer);

// DELETE /api/players/:id - Supprimer un joueur
router.delete("/:id", authenticateToken, deletePlayer);

export default router;
