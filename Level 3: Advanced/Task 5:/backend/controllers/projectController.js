const Project = require("../models/projectModel");
const allowedStatuses = ["Backlog", "In Progress", "Done"];

function projectPayload(req, res) {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  const status = req.body.status || "In Progress";

  if (!title || !description) {
    res.status(400).json({ success: false, message: "Title and description are required" });
    return null;
  }

  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ success: false, message: "Status must be Backlog, In Progress, or Done" });
    return null;
  }

  return { title, description, status };
}

async function getProjects(req, res) {
  try {
    await Project.updateMany({ status: { $exists: false } }, { $set: { status: "In Progress" } });
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Load projects failed:", error.message);
    res.status(500).json({ success: false, message: "Unable to load projects" });
  }
}

async function createProject(req, res) {
  try {
    const payload = projectPayload(req, res);

    if (!payload) return;

    const project = await Project.create(payload);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Create project failed:", error.message);
    res.status(400).json({ success: false, message: error.message || "Unable to create project" });
  }
}

async function updateProject(req, res) {
  try {
    const payload = projectPayload(req, res);

    if (!payload) return;

    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Update project failed:", error.message);
    res.status(400).json({ success: false, message: error.message || "Unable to update project" });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Delete project failed:", error.message);
    res.status(400).json({ success: false, message: error.message || "Unable to delete project" });
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
