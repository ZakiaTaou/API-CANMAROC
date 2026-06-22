import express from "express";
import sequelize from "./src/config/database.js";

import "./src/models/User.js";
import "./src/models/Team.js";
import "./src/models/Player.js";
import "./src/models/Match.js";

import authRoutes from "./src/routes/authRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";

import playerRoutes from "./src/routes/playerRoutes.js";

import matchRoutes from "./src/routes/matchRoutes.js";

const app = express();
const port = 5000;
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);

app.use("/api/players", playerRoutes);

app.use("/api/matchs", matchRoutes);
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    service: "api-canmaroc",
    timestamp: new Date().toISOString(),
  });
});
sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.log("Error DB:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// {
//     "teamhomeid":2,
//     "teamawayid":1,
//     "match_date":"19-8-206",
//     "stadium": "arena ",
//     "status":"schedled",
//     "score_home": 2,
//     "score_away": 3
// }
