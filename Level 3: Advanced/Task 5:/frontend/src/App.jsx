import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle2, CircleDot, Inbox, LayoutGrid, Plus, Search, Settings, Sparkles } from "lucide-react";

const API_URL = "http://localhost:5100/api/projects";
const emptyProject = { title: "", description: "", status: "In Progress" };
const statuses = ["Backlog", "In Progress", "Done"];

function App() {
  const [projects, setProjects] = useState([]);
  const [draft, setDraft] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");

  const grouped = useMemo(
    () => statuses.map((status) => ({ status, projects: projects.filter((project) => project.status === status) })),
    [projects]
  );

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data.data || []);
      setMessage("");
    } catch (error) {
      setMessage("Connect MongoDB and start the API to load projects.");
    }
  }

  async function createProject(event) {
    event.preventDefault();

    try {
      await axios.post(API_URL, draft);
      setDraft(emptyProject);
      setIsAdding(false);
      loadProjects();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to add project.");
    }
  }

  async function updateProject(project, updates) {
    const nextProject = { ...project, ...updates };
    setProjects((current) => current.map((item) => (item._id === project._id ? nextProject : item)));

    try {
      await axios.put(`${API_URL}/${project._id}`, {
        title: nextProject.title,
        description: nextProject.description,
        status: nextProject.status
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save project.");
      loadProjects();
    }
  }

  function updateProjectLocally(projectId, updates) {
    setProjects((current) => current.map((project) => (project._id === projectId ? { ...project, ...updates } : project)));
  }

  async function persistProject(project) {
    try {
      await axios.put(`${API_URL}/${project._id}`, {
        title: project.title,
        description: project.description,
        status: project.status
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save project.");
      loadProjects();
    }
  }

  async function deleteProject(projectId) {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      loadProjects();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete project.");
    }
  }

  return (
    <main className="workspace-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Sparkles size={15} /></div>
          <span>Workspace</span>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <a className="active" href="#projects"><LayoutGrid size={16} /> Projects</a>
          <a href="#inbox"><Inbox size={16} /> Inbox</a>
          <a href="#settings"><Settings size={16} /> Settings</a>
        </nav>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="command-bar">
            <Search size={15} />
            <span>Search workspace</span>
            <kbd>⌘K</kbd>
          </div>

          <button type="button" className="add-project-button" onClick={() => setIsAdding((current) => !current)}>
            <Plus size={15} /> Add Project
          </button>
        </header>

        <section className="page-heading">
          <div>
            <span className="eyebrow">PROJECTS</span>
            <h1>Product workspace</h1>
          </div>
          <p>{projects.length} projects</p>
        </section>

        {message && <div className="toast">{message}</div>}

        {isAdding && (
          <form className="quick-add" onSubmit={createProject}>
            <input
              aria-label="Project title"
              placeholder="Project title"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <input
              aria-label="Project description"
              placeholder="Description"
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
            <select
              aria-label="Project status"
              value={draft.status}
              onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
            >
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <button type="submit">Create</button>
          </form>
        )}

        <section className="project-board" id="projects">
          {grouped.map((group) => (
            <div className="status-column" key={group.status}>
              <div className="column-header">
                <span className={`status-dot ${group.status.toLowerCase().replaceAll(" ", "-")}`} />
                <span>{group.status.toUpperCase()}</span>
                <small>{group.projects.length}</small>
              </div>

              <div className="project-list">
                {group.projects.map((project) => (
                  <article className="project-row" key={project._id}>
                    <button
                      type="button"
                      className="status-icon"
                      onClick={() => updateProject(project, { status: project.status === "Done" ? "In Progress" : "Done" })}
                      aria-label="Toggle status"
                    >
                      {project.status === "Done" ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                    </button>

                    <div className="editable-fields">
                      <input
                        value={project.title}
                        onFocus={() => setEditingId(project._id)}
                        onBlur={(event) => {
                          setEditingId(null);
                          persistProject({ ...project, title: event.target.value });
                        }}
                        onChange={(event) => updateProjectLocally(project._id, { title: event.target.value })}
                      />
                      <textarea
                        rows="2"
                        value={project.description}
                        onFocus={() => setEditingId(project._id)}
                        onBlur={(event) => {
                          setEditingId(null);
                          persistProject({ ...project, description: event.target.value });
                        }}
                        onChange={(event) => updateProjectLocally(project._id, { description: event.target.value })}
                      />
                    </div>

                    <select
                      value={project.status}
                      onChange={(event) => updateProject(project, { status: event.target.value })}
                      aria-label="Project status"
                    >
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>

                    <button type="button" className={editingId === project._id ? "row-action visible" : "row-action"} onClick={() => deleteProject(project._id)}>
                      Delete
                    </button>
                  </article>
                ))}

                {group.projects.length === 0 && <div className="empty-state">No projects</div>}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

export default App;
