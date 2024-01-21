const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const db = require("./models");
const Role = db.role;
// const toastr = require("toastr");

//8080
// middlewares
// app.use(adminBro.routes.rootPath, router);
localhost: app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.options("*", cors());
//solving cors issue
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Credentials: true")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // res.header("Access-Control-Max-Age", "1000")
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// import route
const postsRoute = require("./routes/register");
const sendRoute = require("./routes/logins");
const orderRoute = require("./routes/orders");
const forgotRoute = require("./routes/forgotpassword");
const resetRoute = require("./routes/resetpassword");
const updateRoute = require("./routes/updatepassword");
const viaEmailRoute = require("./routes/UpdatepasswordviaEmail");
const findusersRoute = require("./routes/findUsers");

// connect to DB
app.use("/signup", postsRoute);
app.use("/login", sendRoute);
app.use("/order", orderRoute);
app.use("/forgotPassword", forgotRoute);
app.use("/reset", resetRoute);
app.use("/updatePassword", updateRoute);
app.use("/updatePasswordViaEmail", viaEmailRoute);
app.use("/findUser", findusersRoute);

mongoose.Promise = global.Promise;

app.get("/", (req, res) => {
  res.send("app is running");
});
// app.get('/*', (req, res) =>{
//    res.sendFile(path.join(__dirname, "../front", "index.html"))
// });

//Roles

function initial() {
  Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        return Promise.all([
          new Role({ name: "user" }).save(),
          new Role({ name: "admin" }).save(),
        ]);
      }
    })
    .then(() => {
      console.log("Roles initialization complete");
    })
    .catch((err) => {
      console.error("Error initializing roles:", err);
    });
}
initial();
// connect to database
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"));

//  app.listen(PORT, () => console.log('AdminBro is under localhost:8080/admin'))r

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));

module.exports = app;
