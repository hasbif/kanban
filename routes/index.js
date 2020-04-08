const express = require("express");
const route = express.Router();
const taskroute = require("./taskroutes");
const UserController = require("../controllers/usercontroller");
route.post("/register", UserController.register);
route.post("/login", UserController.login);
route.post('/google-sign-in', UserController.google)


route.use("/task", taskroute);

module.exports = route;
