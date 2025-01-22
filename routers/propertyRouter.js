const express = require("express");
const router = express.Router();
const controller = require("../controllers/propertyController");

//index
router.get("/", controller.index);

//show
router.get("/:id", controller.show);

//store
router.post("/", controller.store);

module.exports = router;
