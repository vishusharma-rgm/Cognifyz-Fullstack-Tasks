const Project = require("../models/projectModel");

function projectPayload(req, res) {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  const status = req.body.status || "In Progress";

  if (!title || !description) {
    res.status(400).json({ success: false, message: "Title and description are required" });
    return null;
  }

  return { title, description, status };
}

async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
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
    res.status(400).json({ success: false, message: "Unable to create project" });
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
    res.status(400).json({ success: false, message: "Unable to update project" });
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
    res.status(400).json({ success: false, message: "Unable to delete project" });
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
