import Team from "../models/Team.js";
import Player from "../models/Player.js";
import { validationResult } from "express-validator";

// ==============================
// GET ALL PLAYERS
// ==============================
export const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.findAll({
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name", "country", "coach"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET PLAYERS BY TEAM
// ==============================
export const getPlayersByTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Équipe non trouvée",
      });
    }

    const players = await Player.findAll({
      where: { team_id: teamId },
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name", "country", "coach"],
        },
      ],
      order: [["number", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: players.length,
      team: team.name,
      data: players,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET PLAYER BY ID
// ==============================
export const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const player = await Player.findByPk(id, {
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name", "country", "coach"],
        },
      ],
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Joueur non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// CREATE PLAYER
// ==============================
export const createPlayer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, position, number, age, team_id } = req.body;

    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Équipe non trouvée",
      });
    }

    const existingPlayer = await Player.findOne({
      where: { team_id, number },
    });

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: `Le numéro ${number} est déjà attribué dans cette équipe`,
      });
    }

    const player = await Player.create({
      name,
      position,
      number,
      age,
      team_id,
    });

    // Recharger avec les données de l'équipe
    await player.reload({
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name", "country", "coach"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Joueur créé avec succès",
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE PLAYER
// ==============================
export const updatePlayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, position, number, age, team_id } = req.body;

    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Joueur non trouvé",
      });
    }

    if (team_id && team_id !== player.team_id) {
      const team = await Team.findByPk(team_id);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Équipe non trouvée",
        });
      }
    }

    if (number && number !== player.number) {
      const existingPlayer = await Player.findOne({
        where: {
          team_id: team_id || player.team_id,
          number,
        },
      });

      if (existingPlayer && existingPlayer.id !== player.id) {
        return res.status(400).json({
          success: false,
          message: `Le numéro ${number} est déjà attribué dans cette équipe`,
        });
      }
    }

    await player.update({
      name: name || player.name,
      position: position || player.position,
      number: number || player.number,
      age: age || player.age,
      team_id: team_id || player.team_id,
    });

    // Recharger avec les données de l'équipe
    await player.reload({
      include: [
        {
          model: Team,
          as: "team",
          attributes: ["id", "name", "country", "coach"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Joueur mis à jour avec succès",
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE PLAYER
// ==============================
export const deletePlayer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Joueur non trouvé",
      });
    }

    await player.destroy();

    res.status(200).json({
      success: true,
      message: "Joueur supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
