const Project = require("../models/Project");

function getUserProjects(userId) {
  return Project.find({ owner: userId }).sort({ createdAt: -1 });
}

function createProject(userId, projectData) {
  return Project.create({
    ...projectData,
    owner: userId
  });
}

function updateProject(userId, projectId, projectData) {
  return Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    projectData,
    { new: true, runValidators: true }
  );
}

function deleteProject(userId, projectId) {
  return Project.findOneAndDelete({ _id: projectId, owner: userId });
}

module.exports = {
  getUserProjects,
  createProject,
  updateProject,
  deleteProject
};
