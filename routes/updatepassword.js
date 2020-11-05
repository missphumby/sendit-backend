const express = require("express");
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router();
const User = require("../models/usersReg");
const jwt = require('jsonwebtoken');

const BCRYPT_SALT_ROUNDS = 12;

  router.put('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        User.find({
            username: req.body.username
        }).exec()
        .then((userInfo) => {
          if (userInfo != null) {
            console.log('user found in db');
            bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
              .then((hashedPassword) => {
                userInfo.update({
                  password: hashedPassword,
                });
              })
              .then(() => {
                console.log('password updated');
                res
                  .status(200)
                  .send({ auth: true, message: 'password updated' });
              });
          } else {
            console.error('no user exists in db to update');
            res.status(404).json('no user exists in db to update');
          }
        });
      }
    })(req, res, next);
  });

  module.exports = router