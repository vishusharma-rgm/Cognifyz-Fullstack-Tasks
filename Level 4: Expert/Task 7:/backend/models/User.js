const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    githubUsername: {
      type: String,
      trim: true
    },
    githubAccessToken: {
      type: String,
      select: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
