//importation des packages de node.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const helmet = require("helmet");
// require dotenv

const dotenv = require("dotenv");

// instantiate the instance of dotenv

dotenv.config();

/*
//HELMET
  app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
//app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
*/
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15minutes
    max: 100, //limiter chaque adresse ip à 100 requêtes par windowMs
    message: "Trop de comptes ont été créés avec cette adresse IP"
  });
 // app.use(limiter);
//connection à mongodb avec id et mot de passe (securisation dot.env)
mongoose
  .connect(process.env.DATABASE_CONNEXION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());



app.use((req, res, next) => {
  //qui peut acceder à l'API
  res.setHeader("Access-Control-Allow-Origin", "*" );
  //quels headers sont autorisés
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  //quels méthodes sont possibles
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
// Gestion des principaux chemins de l'API sauces, auth, images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
