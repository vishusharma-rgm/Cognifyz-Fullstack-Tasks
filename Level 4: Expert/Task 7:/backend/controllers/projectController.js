const projectService = require("../services/projectService");

function validateProject(req, res) {
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
    const projects = await projectService.getUserProjects(req.user._id);
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load projects" });
  }
}

async function createProject(req, res) {
  try {
    const payload = validateProject(req, res);

    if (!payload) {
      return;
    }

    const project = await projectService.createProject(req.user._id, payload);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create project" });
  }
}

async function updateProject(req, res) {
  try {
    const payload = validateProject(req, res);

    if (!payload) {
      return;
    }

    const project = await projectService.updateProject(req.user._id, req.params.id, payload);

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
    const project = await projectService.deleteProject(req.user._id, req.params.id);

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
