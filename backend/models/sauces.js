//Importation du package mongoose pour la DB
const mongoose = require("mongoose");

//Definition du schéma pour mongoose sous form JSON
const saucesSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },

  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
  userDisliked: { type: Array, default: [] },
  mainPepper: { type: String, required: true }
});

module.exports = mongoose.model("sauces", saucesSchema);
