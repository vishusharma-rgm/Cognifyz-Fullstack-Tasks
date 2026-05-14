const express = require("express");
const protect = require("../middleware/auth");
const projectController = require("../controllers/projectController");
const { cacheProjects } = require("../middleware/cache");

const router = express.Router();

router.use(protect);

router.get("/", cacheProjects, projectController.getProjects);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
