const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController.js");

//index
router.get("/", controller.index);

module.exports = router;
