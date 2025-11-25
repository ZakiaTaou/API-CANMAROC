const { Player, Team } = require('../models');
const { validationResult } = require('express-validator');


const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Player.findAll({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'country']
      }],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    next(error);
  }
};


const getPlayersByTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    // Vérifier si l'équipe existe
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    const players = await Player.findAll({
      where: { team_id: teamId },
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'country']
      }],
      order: [['number', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: players.length,
      team: team.name,
      data: players
    });
  } catch (error) {
    next(error);
  }
};


const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const player = await Player.findByPk(id, {
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'country', 'coach']
      }]
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};


const createPlayer = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, position, number, age, team_id } = req.body;

    // Vérifier si l'équipe existe
    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }

    // Vérifier si le numéro est déjà pris dans cette équipe
    const existingPlayer = await Player.findOne({
      where: { team_id, number }
    });

    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: `Le numéro ${number} est déjà attribué dans cette équipe`
      });
    }

    // Créer le joueur
    const player = await Player.create({
      name,
      position,
      number,
      age,
      team_id
    });

    // Recharger avec les données de l'équipe
    await player.reload({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'country']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Joueur créé avec succès',
      data: player
    });
  } catch (error) {
    next(error);
  }
};


const updatePlayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, position, number, age, team_id } = req.body;

    // Vérifier si le joueur existe
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    // Si team_id change, vérifier que la nouvelle équipe existe
    if (team_id && team_id !== player.team_id) {
      const team = await Team.findByPk(team_id);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Équipe non trouvée'
        });
      }
    }

    // Si le numéro change, vérifier qu'il n'est pas déjà pris
    if (number && number !== player.number) {
      const existingPlayer = await Player.findOne({
        where: {
          team_id: team_id || player.team_id,
          number
        }
      });

      if (existingPlayer && existingPlayer.id !== player.id) {
        return res.status(400).json({
          success: false,
          message: `Le numéro ${number} est déjà attribué dans cette équipe`
        });
      }
    }

    // Mettre à jour le joueur
    await player.update({
      name: name || player.name,
      position: position || player.position,
      number: number || player.number,
      age: age || player.age,
      team_id: team_id || player.team_id
    });

    // Recharger avec les données de l'équipe
    await player.reload({
      include: [{
        model: Team,
        as: 'team',
        attributes: ['id', 'name', 'country']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Joueur mis à jour avec succès',
      data: player
    });
  } catch (error) {
    next(error);
  }
};


const deletePlayer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier si le joueur existe
    const player = await Player.findByPk(id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    // Supprimer le joueur
    await player.destroy();

    res.status(200).json({
      success: true,
      message: 'Joueur supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlayers,
  getPlayersByTeam,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};