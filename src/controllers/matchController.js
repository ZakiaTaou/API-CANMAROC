import Match from '../models/Match.js';
import Team from '../models/Team.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';


export const getAllMatches = async (req, res, next) => {
  try {
    const matches = await Match.findAll({
      include: [
  {
    model: Team,
    as: 'HomeTeam', 
    attributes: ['id', 'name', 'country', 'flag_url']
  },
  {
    model: Team,
    as: 'AwayTeam',  
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
    next(error);
  }
};


export const getUpcomingMatches = async (req, res, next) => {
  try {
    const now = new Date();
    
    const matches = await Match.findAll({
      where: {
        match_date: {
          [Op.gte]: now
        },
        status: 'scheduled'
      },
      include: [
        {
          model: Team,
          as: 'HomeTeam',
          attributes: ['id', 'name', 'country', 'flag_url']
        },
        {
          model: Team,
          as: 'AwayTeam',
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
    next(error);
  }
};


export const getMatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await Match.findByPk(id, {
      include: [
        {
          model: Team,
          as: 'HomeTeam',
          attributes: ['id', 'name', 'country', 'flag_url', 'coach']
        },
        {
          model: Team,
          as: 'AwayTeam',
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
    next(error);
  }
};


export const createMatch = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { teamhomeid, teamawayid, match_date, stadium, status, score_home, score_away } = req.body;

    // Vérifier que les deux équipes existent
    const homeTeam = await Team.findByPk(teamhomeid);
    const awayTeam = await Team.findByPk(teamawayid);

    if (!homeTeam) {
      return res.status(404).json({
        success: false,
        message: 'Équipe domicile non trouvée'
      });
    }

    if (!awayTeam) {
      return res.status(404).json({
        success: false,
        message: 'Équipe extérieure non trouvée'
      });
    }

    // Vérifier que les équipes sont différentes
    if (teamhomeid === teamawayid) {
      return res.status(400).json({
        success: false,
        message: 'Les deux équipes doivent être différentes'
      });
    }

    // Créer le match
    const match = await Match.create({
      teamhomeid,
      teamawayid,
      match_date,
      stadium,
      status: status || 'scheduled',
      score_home: score_home || 0,
      score_away: score_away || 0
    });

    // Recharger avec les équipes
    await match.reload({
      include: [
        { model: Team, as: 'HomeTeam', attributes: ['id', 'name', 'country'] },
        { model: Team, as: 'AwayTeam', attributes: ['id', 'name', 'country'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Match créé avec succès',
      data: match
    });
  } catch (error) {
    next(error);
  }
};


export const updateMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamhomeid, teamawayid, match_date, stadium, status, score_home, score_away } = req.body;

    // Vérifier si le match existe
    const match = await Match.findByPk(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    // Si les équipes changent, vérifier qu'elles existent et sont différentes
    if (teamhomeid && teamhomeid !== match.teamhomeid) {
      const homeTeam = await Team.findByPk(teamhomeid);
      if (!homeTeam) {
        return res.status(404).json({
          success: false,
          message: 'Équipe domicile non trouvée'
        });
      }
    }

    if (teamawayid && teamawayid !== match.teamawayid) {
      const awayTeam = await Team.findByPk(teamawayid);
      if (!awayTeam) {
        return res.status(404).json({
          success: false,
          message: 'Équipe extérieure non trouvée'
        });
      }
    }

    // Mettre à jour le match
    await match.update({
      teamhomeid: teamhomeid || match.teamhomeid,
      teamawayid: teamawayid || match.teamawayid,
      match_date: match_date || match.match_date,
      stadium: stadium || match.stadium,
      status: status || match.status,
      score_home: score_home !== undefined ? score_home : match.score_home,
      score_away: score_away !== undefined ? score_away : match.score_away
    });

    // Recharger avec les équipes
    await match.reload({
      include: [
        { model: Team, as: 'HomeTeam', attributes: ['id', 'name', 'country'] },
        { model: Team, as: 'AwayTeam', attributes: ['id', 'name', 'country'] }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Match mis à jour avec succès',
      data: match
    });
  } catch (error) {
    next(error);
  }
};


export const deleteMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier si le match existe
    const match = await Match.findByPk(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match non trouvé'
      });
    }

    // Supprimer le match
    await match.destroy();

    res.status(200).json({
      success: true,
      message: 'Match supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

