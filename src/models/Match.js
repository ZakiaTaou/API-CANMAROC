import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Team from "./Team.js";

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    teamhomeid: {
      type: DataTypes.INTEGER,
      references: {
        model: "Teams",
        key: "id",
      },
      allowNull: false,
    },

    teamawayid: {
      type: DataTypes.INTEGER,
      references: {
        model: "Teams",
        key: "id",
      },
      allowNull: false,
    },

    score_home: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    score_away: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    match_date: {
      type: DataTypes.DATE,
    },

    stadium: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("scheduled", "live", "finished"),
      defaultValue: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

Match.belongsTo(Team, { as: "HomeTeam", foreignKey: "teamhomeid" });
Match.belongsTo(Team, { as: "AwayTeam", foreignKey: "teamawayid" });

export default Match;
