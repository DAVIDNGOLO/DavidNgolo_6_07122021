const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const MaskData = require("maskdata");

const User = require("../models/user");

const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 4,
  unmaskedEndCharactersAfterAt: 4,
  maskAtTheRate: false,
};

exports.signup = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email, emailMask2Options);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: maskedEmail,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  
  User.findOne({ email: MaskData.maskEmail2(req.body.email, emailMask2Options) })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      //bcrypt : hachage sécurisé
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
