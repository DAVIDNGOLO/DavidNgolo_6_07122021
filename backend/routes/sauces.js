const express = require("express");
const router = express.Router();

//Définition des chemins sauces, athorisation et multer qui serviront pour le router
const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Chaque route à son CRUD (get, post, delete, put) avec son chemin et ses droits
router.post("/", auth, multer, saucesCtrl.createSauces);
router.put("/:id", auth, multer, saucesCtrl.modifySauces);
router.delete("/:id", auth, saucesCtrl.deleteSauces);
router.get("/:id", auth, saucesCtrl.getOneSauces);
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/:id/like", auth, saucesCtrl.createLike);

module.exports = router;
