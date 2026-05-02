let projects = [
  {
    id: 1,
    title: "Client Portal Launch",
    description: "Finalize onboarding screens, API contracts, and launch checklist."
  },
  {
    id: 2,
    title: "Analytics Refresh",
    description: "Update dashboard metrics and improve reporting performance."
  },
  {
    id: 3,
    title: "Mobile Experience",
    description: "Polish responsive workflows for project reviews and approvals."
  }
];

let nextId = 4;

function getProjects() {
  return projects;
}

function createProject(projectData) {
  const project = {
    id: nextId++,
    title: projectData.title,
    description: projectData.description
  };

  projects.unshift(project);
  return project;
}

function updateProject(id, projectData) {
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return null;
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    title: projectData.title,
    description: projectData.description
  };

  return projects[projectIndex];
}

function deleteProject(id) {
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return null;
  }

  return projects.splice(projectIndex, 1)[0];
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
