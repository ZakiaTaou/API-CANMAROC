import express from "express";
import sequelize from "./src/config/database.js";

import "./src/models/User.js";
import "./src/models/Team.js";
import "./src/models/Player.js";
import "./src/models/Match.js";

const app = express();
const port = 5000;
app.use(express.json());

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.log("Error DB:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
