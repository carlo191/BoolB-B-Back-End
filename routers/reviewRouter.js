const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviewController");

//store
router.post("/", controller.store);

//update
router.put("/:id", controller.update);

//delete
router.delete("/:id", controller.destroy);

module.exports = router;
