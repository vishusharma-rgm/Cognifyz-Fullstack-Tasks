const express = require("express");
const protect = require("../middleware/auth");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.get("/", projectController.getProjects);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
