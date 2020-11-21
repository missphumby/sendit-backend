const express = require("express");
const crypto = require('crypto')
require('dotenv').config();
const router = express.Router();
const User = require("../models/usersReg");
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// module.exports = (router) => {

  router.post('/', (req, res) => {
    if (req.body.email === '') {
      res.status(400).send('email required');
    }
    console.error(req.body.email);
    User.find({
        email: req.body.email
    })
    .exec()
    .then((user) => {
      if (user === null) {
        console.error('email not in database');
        res.status(403).send({message: 'email not in db', error});
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        User.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        });

        const transporter = nodemailer.createTransport( smtpTransport ({
          service: 'gmail',
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        })
        );

        const mailOptions = {
          from: 'mongodbDemoEmail@gmail.com',
          to: req.body.email,
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `https://send-itt-react.herokuapp.com/reset/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json({message: 'recovery email sent', token: token});
          }
        });
      }
    });
  });

  module.exports = router;