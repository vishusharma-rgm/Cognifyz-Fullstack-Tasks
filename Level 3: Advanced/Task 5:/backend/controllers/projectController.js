const Project = require("../models/projectModel");

function validateProjectPayload(req, res) {
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();

  if (!title || !description) {
    res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
    return null;
  }

  return { title, description };
}

function getProjects(req, res) {
  res.status(200).json({ success: true, data: Project.getProjects() });
}

function createProject(req, res) {
  const payload = validateProjectPayload(req, res);

  if (!payload) {
    return;
  }

  const project = Project.createProject(payload);
  res.status(201).json({ success: true, data: project });
}

function updateProject(req, res) {
  const payload = validateProjectPayload(req, res);

  if (!payload) {
    return;
  }

  const project = Project.updateProject(Number(req.params.id), payload);

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  res.status(200).json({ success: true, data: project });
}

function deleteProject(req, res) {
  const project = Project.deleteProject(Number(req.params.id));

  if (!project) {
    return res.status(404).json({ success: false, message: "Project not found" });
  }

  res.status(200).json({ success: true, data: project });
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
