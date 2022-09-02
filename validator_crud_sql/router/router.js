const express = require("express");
const app = express();
const controller = require("../controller/controller")

const register = express.Router();

register.post("/insert",controller.insert);
// localhost:5151/register/insert
register.get("/find", controller.find);
register.get("/show", controller.show);
register.put("/update", controller.update)
register.delete("/delete", controller.delete)

module.exports = register;