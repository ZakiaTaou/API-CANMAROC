import Team from '../models/Team.js';
import Player from '../models/Player.js';
import { validationResult } from 'express-validator';

export const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      include: [{
        model: Player,
        as: 'players',
        attributes: ['id', 'name', 'position', 'number']
      }],
      order: [['name', 'ASC']]
    });
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      include: [{
        model: Player,
        as: 'players',
        attributes: ['id', 'name', 'position', 'number', 'age']
      }]
    });
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }
    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    const { name, country, flag_url, coach, group } = req.body;
    const existingTeam = await Team.findOne({ where: { name } });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Une équipe avec ce nom existe déjà'
      });
    }
    const team = await Team.create({
      name,
      country,
      flag_url,
      coach,
      group
    });
    res.status(201).json({
      success: true,
      message: 'Équipe créée avec succès',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, country, flag_url, coach, group } = req.body;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }
    if (name && name !== team.name) {
      const existingTeam = await Team.findOne({ where: { name } });
      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: 'Une équipe avec ce nom existe déjà'
        });
      }
    }
    await team.update({
      name: name || team.name,
      country: country || team.country,
      flag_url: flag_url || team.flag_url,
      coach: coach || team.coach,
      group: group || team.group
    });
    res.status(200).json({
      success: true,
      message: 'Équipe mise à jour avec succès',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Équipe non trouvée'
      });
    }
    await team.destroy();
    res.status(200).json({
      success: true,
      message: 'Équipe supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};