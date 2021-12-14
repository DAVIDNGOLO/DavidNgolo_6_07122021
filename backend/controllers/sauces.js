const sauces = require("../models/sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauces);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    
  }); //les images et textes douvent etre traité différement, elles sont appelées via leur URI
  sauces
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file
    ? {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body }; //comme un url il faut definir le chemin avec un protocole http, un hote(localhost), et le nom du fichier
  sauces
    .updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.deleteSauces = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauces) => {
      const filename = sauces.imageUrl.split("/images/")[1]; //Pour la suppression des images, utilisation de Split
      fs.unlink(`images/${filename}`, () => {
        sauces
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
  sauces
    .findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
exports.getAllSauces = (req, res, next) => {
  //appel de toutes les sauces avec request, result et next pour passer au prochain controller
  sauces
    .find() //Demande à la base de données les sauces avec find
    .then((sauces) => res.status(200).json(sauces)) // then si le retour est ok avec le code 200
    .catch((error) => res.status(400).json({ error })); // catch si le retour est ko avec le code 400
};

exports.createLike = (req, res) => {
  //Récupération d'une seule Sauce avec 'findOne'
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      // la personne n'aime pas la sauce
      if (req.body.like == -1) {
        sauce.dislikes++; // ajout d'un dislike
        sauce.usersDisliked.push(req.body.userId); // ajout du username + dislike dans le tableau
        sauce.save();
      }
      // la personne aime la sauce
      if (req.body.like == 1) {
        sauce.likes++; // ajout d'un like
        sauce.usersLiked.push(req.body.userId); // ajout du username + like dans le tableau
        sauce.save();
      }
      //réponse de réussite code 200
      res.status(200).json({ message: "like pris en compte" });
    })
    .catch((error) => {
      res.status(400).json({ error });
      //réponse d'erreur avec code 500
    });
};
