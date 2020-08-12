const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const db = require("../models");
const Role = db.role;

//import model
const User = require('../models/usersReg');
const { generateToken } = require('../auth/verifyToken');

router.get('/', (req, res) => {
  res.send('they are on home')
});

router.post("/", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(409).json({ message: "mail exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const { firstname, lastname, email, mobile } = req.body;
            const user = {
              firstname,
              lastname,
              email,
              mobile,
              password: hash,
            };

            User.create(user, (err, user) => {
              if (err) throw err;
              // signUp(user);

            user.save((err, user) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              else if(user){
              if (req.body.roles) {
                Role.find(
                  {
                    name: { $in: req.body.roles }
                  },
                  (err, roles) => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
          
                    user.roles = roles.map(role => role._id);
                    user.save((err, result) => {
                      if (err) {
                        res.status(500).send({ message: err });
                        return;
                      }
                       if(result){
                      // res.send({ message: "User was registered successfully!", 
                      // user}),
                      generateToken(user, (err, token) => {
                        // const user = user[0];
                        console.log("got here", token)
                        if (err) {
                          res.json({ error: "Unable to encode token" });
                        } else {
                          res.status(201).send({
                            success: "User created successfully!",
                            user,
                            token,
                          });
                      }
        
                      });
                  }
                    })
                  });
              } else {
                Role.findOne({ name: "user" }, (err, role) => {
                  if (err) {
                    res.status(500).send({ message: err });
                    return;
                  }
          
                  user.roles = [role._id];
                  user.save((err, result) => {
                    console.log(user)
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
                    if(result){
                    
 generateToken(user, (err, token) => {
  console.log("got here", token)
  if (err) {
    res.json({ error: "Unable to encode token" });
  } else {
    res.status(201).send({
      success: "User created successfully!",
      user,
      token,
    });
}

});
}        
                  });
                });
              
              }
            }
            })
        
          })
      }
        });
}
})
});



module.exports = router;
