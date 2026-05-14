const express = require("express");
const protect = require("../middleware/auth");
const integrationController = require("../controllers/integrationController");

const router = express.Router();

router.use(protect);
router.get("/github/repos", integrationController.getGithubRepositories);

module.exports = router;
