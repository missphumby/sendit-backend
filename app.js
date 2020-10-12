const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const morgan = require('morgan')
const cors = require('cors')
require("dotenv").config()
const db = require("./models");
const Role = db.role;
const toastr = require('toastr')

  
// middlewares
// app.use(adminBro.routes.rootPath, router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
  app.use(morgan('dev'))
app.use(cors())
// app.use(toastr())
//solving cors issue
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    // res.header("Access-Control-Allow-Credentials: true") 
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    // res.header("Access-Control-Max-Age", "1000")
    if (req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})


// import route
const postsRoute = require('./routes/register');
const sendRoute = require('./routes/logins');
const orderRoute = require('./routes/orders')

// connect to DB
app.use('/signup', postsRoute);
app.use('/login', sendRoute);
app.use('/order', orderRoute)
mongoose.Promise = global.Promise;

app.get("/", (req, res) => {
  res.send("app is running")
})
// app.get('/*', (req, res) =>{
//    res.sendFile(path.join(__dirname, "../front", "index.html"))
// });

//Roles
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
      
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }
  
  initial();
  
// connect to database
 mongoose.connect(process.env.DB_CONNECTION, 
{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false},
()=>console.log('connected to DB')
);



//  app.listen(PORT, () => console.log('AdminBro is under localhost:8080/admin'))r

app.listen(PORT, () => console.log(`app is running on port ${PORT}`))

module.exports = app;