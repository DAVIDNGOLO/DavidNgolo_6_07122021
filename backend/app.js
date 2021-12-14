//importation des packages de node.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

//connection à mongodb avec id et mot de passe
mongoose
  .connect("mongodb+srv://DavidNK:Proton7845_@cluster0.xuxnn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  //qui peut acceder à l'API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
// Gestion des principaux chemins de l'API sauces, auth, images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
