const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviewController");

//index
router.get("/", controller.index);

//show
router.get("/:id", controller.show);

//store
router.post("/", controller.store);

//update
router.put("/:id", controller.update);

//delete
router.delete("/:id", controller.destroy);

module.exports = router;
