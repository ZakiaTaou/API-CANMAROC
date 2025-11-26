const Match = require('../models/Match');
const Team = require('../models/Team');
const { Op } = require('sequelize');

// GET /api/matches - Liste tous les matches
exports.getAllMatches = async (req, res) => {
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
exports.getUpcomingMatches = async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.findAll({
      where: {
        match_date: {
          [Op.gte]: now
        },
        status: {
          [Op.in]: ['scheduled', 'live']
        }
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
exports.getMatchById = async (req, res) => {
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
exports.createMatch = async (req, res) => {
  try {
    const { teamHomeId, teamAwayId, matchDate, stadium, status } = req.body;

    // Validation
    if (!teamHomeId || !teamAwayId || !matchDate || !stadium) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Vérifier que les équipes sont différentes
    if (teamHomeId === teamAwayId) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe ne peut pas jouer contre elle-même'
      });
    }

    // Vérifier que les équipes existent
    const homeTeam = await Team.findByPk(teamHomeId);
    const awayTeam = await Team.findByPk(teamAwayId);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({
        success: false,
        message: 'Une ou plusieurs équipes n\'existent pas'
      });
    }

    const match = await Match.create({
      teamHomeId,
      teamAwayId,
      matchDate,
      stadium,
      status: status || 'scheduled'
    });

    // Récupérer le match avec les relations
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
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    const { teamHomeId, teamAwayId, scoreHome, scoreAway, matchDate, stadium, status } = req.body;

    // Vérifier que les équipes sont différentes si elles sont modifiées
    if (teamHomeId && teamAwayId && teamHomeId === teamAwayId) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe ne peut pas jouer contre elle-même'
      });
    }

    // Mettre à jour le match
    await match.update({
      teamHomeId: teamHomeId || match.teamHomeId,
      teamAwayId: teamAwayId || match.teamAwayId,
      scoreHome: scoreHome !== undefined ? scoreHome : match.scoreHome,
      scoreAway: scoreAway !== undefined ? scoreAway : match.scoreAway,
      matchDate: matchDate || match.matchDate,
      stadium: stadium || match.stadium,
      status: status || match.status
    });

    // Récupérer le match mis à jour avec les relations
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

// DELETE /api/matches/:id - Supprimer un match (Admin uniquement)
exports.deleteMatch = async (req, res) => {
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