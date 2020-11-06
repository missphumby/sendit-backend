const express = require("express");
const router = express.Router();
const User = require("../models/usersReg");


// module.exports = (app) => {
    router.get('/', (req, res) => {
      User.find({
          resetPasswordToken: req.body.resetPasswordToken,
          resetPasswordExpires: {$gt: Date.now()}
        })
        // .exec()
        .then((user) => {
        if (user == null) {
          console.error('password reset link is invalid or has expired');
          res.status(403).send('password reset link is invalid or has expired');
        } else {
          res.status(200).send({
            username: user.username,
            message: 'password reset link a-ok',
          });
        }
      });
    });
//   };
module.exports = router