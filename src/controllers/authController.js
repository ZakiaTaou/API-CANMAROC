import JWT from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../middlewares/errorHandler.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const generateToken = (userId) => {
  return JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !username || !password) {
      throw new AppError("Tous les champs sont requis", 400);
    }

    if (!emailRegex.test(email)) {
      throw new AppError("Email invalide", 400);
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError(
        "Cet email ou nom d'utilisateur est déjà utilisé",
        409
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email et mot de passe requis", 400);
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "username", "email", "password", "role"],
    });

    if (!user) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email ou mot de passe incorrect", 401);
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Utilisateur introuvable",
    });
  }
  res.status(200).json({
    success: true,
    data: user,
  });
};

export { register, login, getProfile };
