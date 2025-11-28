import express from "express";
import sequelize from "./src/config/database.js";

import "./src/models/User.js";
import "./src/models/Team.js";
import "./src/models/Player.js";
import "./src/models/Match.js";

import authRoutes from "./src/routes/authRoutes.js";
import teamRoutes from "./src/routes/teamRoutes.js";
import matchRoutes from "./src/routes/matchRoutes.js";


const app = express();
const port = 5000;
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matchs", matchRoutes);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.log("Error DB:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
