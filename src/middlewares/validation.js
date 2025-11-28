import { body } from "express-validator";

// ==============================
// VALIDATIONS TEAMS
// ==============================
export const validateTeam = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'équipe est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le nom doit contenir entre 2 et 50 caractères"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Le pays est requis")
    .isLength({ min: 2, max: 50 })
    .withMessage("Le pays doit contenir entre 2 et 50 caractères"),

  body("coach")
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'entraîneur est requis"),

  body("group")
    .trim()
    .notEmpty()
    .withMessage("Le groupe est requis")
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage("Le groupe doit être A, B, C, D, E ou F"),

  body("flag_url")
    .optional()
    .isURL()
    .withMessage("L'URL du drapeau doit être valide"),
];

// ==============================
// VALIDATIONS PLAYERS
// ==============================
// export const validatePlayer = [
//   body('name')
//     .trim()
//     .notEmpty().withMessage('Le nom du joueur est requis')
//     .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),

//   body('position')
//     .trim()
//     .notEmpty().withMessage('La position est requise')
//     .isIn(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'])
//     .withMessage('La position doit être: Goalkeeper, Defender, Midfielder ou Forward'),

//   body('number')
//     .notEmpty().withMessage('Le numéro est requis')
//     .isInt({ min: 1, max: 99 }).withMessage('Le numéro doit être entre 1 et 99'),

//   body('age')
//     .notEmpty().withMessage('L\'âge est requis')
//     .isInt({ min: 16, max: 50 }).withMessage('L\'âge doit être entre 16 et 50 ans'),

//   body('team_id')
//     .notEmpty().withMessage('L\'ID de l\'équipe est requis')
//     .isInt().withMessage('L\'ID de l\'équipe doit être un nombre')
// ];
export const validatePlayer = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom du joueur est requis")
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),

  body("position")
    .trim()
    .notEmpty()
    .withMessage("La position est requise")
    .isIn([
      "Goalkeeper",
      "GK",
      "Defender",
      "Right Back",
      "RB",
      "Left Back",
      "LB",
      "Center Back",
      "CB",
      "Right Wing Back",
      "RWB",
      "Left Wing Back",
      "LWB",
      "Midfielder",
      "CDM",
      "CM",
      "CAM",
      "RM",
      "LM",
      "Forward",
      "RW",
      "LW",
      "ST",
      "CF",
    ])
    .withMessage("Position invalide"),

  body("number")
    .notEmpty()
    .withMessage("Le numéro est requis")
    .isInt({ min: 1, max: 99 })
    .withMessage("Le numéro doit être entre 1 et 99"),

  body("age")
    .notEmpty()
    .withMessage("L'âge est requis")
    .isInt({ min: 16, max: 50 })
    .withMessage("L'âge doit être entre 16 et 50 ans"),

  body("team_id")
    .notEmpty()
    .withMessage("L'ID de l'équipe est requis")
    .isInt()
    .withMessage("L'ID de l'équipe doit être un nombre"),
];

// ==============================
// VALIDATIONS MATCHES
// ==============================
export const validateMatch = [
  body("teamhomeid")
    .notEmpty()
    .withMessage("L'équipe domicile est requise")
    .isInt()
    .withMessage("L'ID doit être un nombre"),

  body("teamawayid")
    .notEmpty()
    .withMessage("L'équipe extérieure est requise")
    .isInt()
    .withMessage("L'ID doit être un nombre")
    .custom((value, { req }) => {
      if (value === req.body.teamhomeid) {
        throw new Error("Les deux équipes doivent être différentes");
      }
      return true;
    }),

  body("match_date")
    .notEmpty()
    .withMessage("La date du match est requise")
    .isISO8601()
    .withMessage("La date doit être au format ISO8601 (YYYY-MM-DD)"),

  body("stadium")
    .trim()
    .notEmpty()
    .withMessage("Le stade est requis")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du stade doit contenir entre 3 et 100 caractères"),

  body("status")
    .optional()
    .isIn(["scheduled", "live", "finished"])
    .withMessage("Le status doit être: scheduled, live ou finished"),

  body("score_home")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le score domicile doit être un nombre positif"),

  body("score_away")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le score extérieur doit être un nombre positif"),
];
