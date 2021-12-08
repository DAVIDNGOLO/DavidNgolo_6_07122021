const sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauces);
    delete saucesObject._id;
    const sauces = new Sauces({
      ...saucesObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauces = (req, res, next) => {
    const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
     sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };
  exports.deleteSauces = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
      .then(sauces => {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.getOneSauces = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));
  };
  exports.getAllSauces = (req, res, next) => {
    sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };