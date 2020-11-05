const express = require("express");
const bcrypt = require('bcrypt')
const User = require('../models/usersReg')
const router = express.Router();

const BCRYPT_SALT_ROUNDS = 12;
// module.exports = app => {
  router.put('/', (req, res) => {
    User.find({
        username: req.body.username,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
    }).exec()
    .then(user => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else if (user != null) {
        console.log('user exists in db');
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            user.update({
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            });
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    });
  });

  module.exports = router;