const express = require("express");
const route = express.Router();
const controller = require("../controllers/taskcontroller");
const { authorize, authenticate } = require('../middlewares/OA')

route.use(authenticate);

route.get("/", controller.list);
route.post("/", controller.add);
route.get("/:id", authorize, controller.getbyId);
route.put("/:id", authorize, controller.edit);
route.delete("/:id", authorize, controller.delete);
module.exports = route;