const User = require("../models/User");
const githubService = require("../services/githubService");

async function getGithubRepositories(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+githubAccessToken");

    if (!user?.githubAccessToken) {
      return res.status(409).json({ success: false, message: "Connect GitHub before loading repositories" });
    }

    const repositories = await githubService.getRepositories(user.githubAccessToken);
    res.status(200).json({ success: true, data: repositories });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGithubRepositories
};
