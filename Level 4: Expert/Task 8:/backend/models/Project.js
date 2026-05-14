const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Backlog", "In Progress", "Done"],
      default: "In Progress"
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model("Project", projectSchema);
