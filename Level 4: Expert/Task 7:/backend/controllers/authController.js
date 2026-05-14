const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const githubService = require("../services/githubService");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    githubConnected: Boolean(user.githubUsername),
    githubUsername: user.githubUsername || ""
  };
}

async function register(req, res) {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      success: true,
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Register failed:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    if (error.message === "JWT_SECRET is required") {
      return res.status(500).json({ success: false, message: "Server JWT secret is missing" });
    }

    res.status(500).json({ success: false, message: error.message || "Unable to create account" });
  }
}

async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login failed:", error.message);

    if (error.message === "JWT_SECRET is required") {
      return res.status(500).json({ success: false, message: "Server JWT secret is missing" });
    }

    res.status(500).json({ success: false, message: error.message || "Unable to sign in" });
  }
}

function startGithubOAuth(req, res) {
  const url = githubService.getAuthorizationUrl();
  res.status(200).json({ success: true, url });
}

async function completeGithubOAuth(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, message: "GitHub authorization code is required" });
  }

  try {
    const accessToken = await githubService.exchangeCodeForToken(code);
    const profile = await githubService.getAuthenticatedUser(accessToken);
    const githubEmail = await githubService.getPrimaryEmail(accessToken);
    const email = githubEmail || `${profile.login}@users.noreply.github.com`;

    const user = await User.findOneAndUpdate(
      { $or: [{ githubId: String(profile.id) }, { email }] },
      {
        name: profile.name || profile.login,
        email,
        githubId: String(profile.id),
        githubUsername: profile.login,
        githubAccessToken: accessToken
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const token = createToken(user._id);
    const redirectUrl = new URL(process.env.FRONTEND_URL || "http://localhost:5173");
    redirectUrl.pathname = "/oauth/github";
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("user", Buffer.from(JSON.stringify(sanitizeUser(user))).toString("base64url"));

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("GitHub OAuth failed:", error.message);
    res.status(500).json({ success: false, message: "Unable to complete GitHub sign in" });
  }
}

module.exports = {
  register,
  login,
  startGithubOAuth,
  completeGithubOAuth
};
