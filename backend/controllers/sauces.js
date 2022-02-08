const Sauces = require("../models/sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  }); //les images et textes doivent etre traité différement, elles sont appelées via leur URI
  sauces
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauces = (req, res, next) => {
  
 
  let saucesObject = {};
  req.file ? (
    // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
    Sauces.findOne({
      _id: req.params.id
    }).then((sauces) => {
      // On supprime l'ancienne image du serveur
      const filename = sauces.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    saucesObject = {
      // On modifie les données et on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
    // Si la modification ne contient pas de nouvelle image
    saucesObject = {
      ...req.body
    }
  )
  Sauces.updateOne(
    // On applique les paramètre de sauceObject
    {
      _id: req.params.id
    }, {
      ...saucesObject,
      _id: req.params.id
    }
  )
  .then(() => res.status(200).json({
    message: 'Sauce modifiée !'
  }))
  .catch((error) => res.status(400).json({
    error
  }))
};
   

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
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
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
exports.getAllSauces = (req, res, next) => {
  //appel de toutes les sauces avec request, result et next pour passer au prochain controller
  Sauces.find() //Demande à la base de données les sauces avec find
    .then((sauces) => res.status(200).json(sauces)) // then si le retour est ok avec le code 200
    .catch((error) => res.status(400).json({ error })); // catch si le retour est ko avec le code 400
};

exports.createLike = (req, res) => {
  console.log(req.body.like);
  //Récupération d'une seule Sauce avec 'findOne'
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      // la personne n'aime pas la sauce
      if (req.body.like === -1) {
        sauces.dislikes++; // ajout d'un dislike
        sauces.usersDisliked.push(req.body.userId); // ajout du username + dislike dans le tableau
        sauces.save();
      }
      // la personne aime la sauce
      if (req.body.like === 1) {
        sauces.likes++; // ajout d'un like
        sauces.usersLiked.push(req.body.userId); // ajout du username + like dans le tableau
        sauces.save();
      }

      // la personne s'est trompée
      if (req.body.like === 0) {
        //ajout de conditions pour que la suppression du Like soit attribué à l'id
        if (sauces.usersLiked.indexOf(req.body.userId) != -1) {
          sauces.likes--; // annulation du like
          sauces.usersLiked.splice(sauces.usersLiked.indexOf(req.body.userId), 1); //Suppression du like en fonction de son id
        }
        /*else{
    conditions pour le dislike
    sauces.dislikes--; // annulation du dislike
    sauces.usersDisliked.splice(sauces.usersDisliked.indexOf(req.body.userId), 1); // Suppression du dislike en fonction de son id
  }*/
        sauces.save();
      }
      //réponse de réussite code 200
      res.status(200).json({ message: "like pris en compte" });
    })
    .catch((error) => {
      res.status(500).json({ error });
      //réponse d'erreur avec code 500
    });
};
