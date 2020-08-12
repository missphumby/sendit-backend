const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();

const db = require("../models");
const Role = db.role;

const { generateToken, authorizeUser } = require("../auth/VerifyToken");

const User = require("../models/usersReg");

router.post("/", (req, res, next) => {
  User.find({ email: req.body.email })
    .populate("roles", "-__v")
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authorization failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          res.status(401).json({
            error: err,
          });
        }
        if (result) {
          generateToken(user[0], (err, token) => {
            if (err) {
              res.json({ msg: "Unable to encode token" });
            } else {
              res.status(201).send({
                msg: "User logged in successfully!",
                user: user[0],
                token,

              });
              
            }

          });
        } else {
          res.status(401).json({
            error: "email or password incorrect",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
});

//logout
router.get("/logout", function (req, res) {
  res.status(200).send({ auth: false, token: null });
});
//fetch user profile
router.get("/me/:id", authorizeUser, (req, res) => {
  if (req.decoded.id == req.params.id) {
    User.findById(req.params.id)
      .populate("roles", "-__v")
      .exec()
      .then((data) => {
        res.status(200).json({ success: true, data });
      })
      .catch(err => res.status(404).send("No user found."))
  } else {
    res.json({ error: "can not fetch data for another user" });
  }
});


module.exports = router;
