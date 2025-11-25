import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    flag_url: {
      type: DataTypes.STRING,
    },

    coach: {
      type: DataTypes.STRING,
    },

    group: {
      type: DataTypes.STRING, 
    },
  },
  {
    timestamps: true,
  }
);

export default Team;
