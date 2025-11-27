import Match from '../models/Match.js';
import Team from '../models/Team.js';
import { Op } from 'sequelize';

// GET /api/matches - Liste tous les matches
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['id', 'name', 'country', 'flag_url']
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['id', 'name', 'country', 'flag_url']
        }
      ],
      order: [['match_date', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des matches',
      error: error.message
    });
  }
};

// GET /api/matches/upcoming - Matches à venir
const getUpcomingMatches = async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.findAll({
      where: {
        match_date: { [Op.gte]: now },
        status: { [Op.in]: ['scheduled', 'live'] }
      },
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['id', 'name', 'country', 'flag_url']
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['id', 'name', 'country', 'flag_url']
        }
      ],
      order: [['match_date', 'ASC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des matches à venir',
      error: error.message
    });
  }
};

// GET /api/matches/:id - Détails d'un match
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, {
      include: [
        {
          model: Team,
          as: 'homeTeam',
          attributes: ['id', 'name', 'country', 'flag_url', 'coach']
        },
        {
          model: Team,
          as: 'awayTeam',
          attributes: ['id', 'name', 'country', 'flag_url', 'coach']
        }
      ]
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du match',
      error: error.message
    });
  }
};

// POST /api/matches - Créer un match (Admin uniquement)
const createMatch = async (req, res) => {
  try {
    const { teamHomeId, teamAwayId, matchDate, stadium, status } = req.body;

    if (!teamHomeId || !teamAwayId || !matchDate || !stadium) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    if (teamHomeId === teamAwayId) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe ne peut pas jouer contre elle-même'
      });
    }

    const homeTeam = await Team.findByPk(teamHomeId);
    const awayTeam = await Team.findByPk(teamAwayId);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({
        success: false,
        message: "Une ou plusieurs équipes n'existent pas"
      });
    }

    const match = await Match.create({
      teamHomeId,
      teamAwayId,
      matchDate,
      stadium,
      status: status || 'scheduled'
    });

    const createdMatch = await Match.findByPk(match.id, {
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Match créé avec succès',
      data: createdMatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du match',
      error: error.message
    });
  }
};

// PUT /api/matches/:id - Modifier un match (Admin uniquement)
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    const {
      teamHomeId,
      teamAwayId,
      scoreHome,
      scoreAway,
      matchDate,
      stadium,
      status
    } = req.body;

    if (teamHomeId && teamAwayId && teamHomeId === teamAwayId) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe ne peut pas jouer contre elle-même'
      });
    }

    await match.update({
      teamHomeId: teamHomeId || match.teamHomeId,
      teamAwayId: teamAwayId || match.teamAwayId,
      scoreHome: scoreHome ?? match.scoreHome,
      scoreAway: scoreAway ?? match.scoreAway,
      matchDate: matchDate || match.matchDate,
      stadium: stadium || match.stadium,
      status: status || match.status
    });

    const updatedMatch = await Match.findByPk(match.id, {
      include: [
        { model: Team, as: 'homeTeam' },
        { model: Team, as: 'awayTeam' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Match mis à jour avec succès',
      data: updatedMatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du match',
      error: error.message
    });
  }
};

// DELETE /api/matches/:id - Supprimer un match
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    await match.destroy();

    res.status(200).json({
      success: true,
      message: 'Match supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du match',
      error: error.message
    });
  }
};

export default {
  getAllMatches,
  getUpcomingMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};