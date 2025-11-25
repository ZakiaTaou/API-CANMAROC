import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Team from "./Team.js";

const Player = sequelize.define(
  "Player",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    position: {
      type: DataTypes.STRING,
    },

    number: {
      type: DataTypes.INTEGER,
    },

    age: {
      type: DataTypes.INTEGER,
    },

    team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Teams",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

Player.belongsTo(Team, { foreignKey: "team_id" });
Team.hasMany(Player, { foreignKey: "team_id" });

export default Player;
