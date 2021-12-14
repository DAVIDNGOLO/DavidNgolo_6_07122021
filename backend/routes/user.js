const express = require("express");
//Importation du router EXPRESS
const router = express.Router();

//Creation du chemin user dans controllers
const userCtrl = require("../controllers/user");

//Les routers signup et login sont en methode Post
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Export du router
module.exports = router;
