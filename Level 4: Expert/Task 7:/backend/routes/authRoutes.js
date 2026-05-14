const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/github", authController.startGithubOAuth);
router.get("/github/callback", authController.completeGithubOAuth);

module.exports = router;
