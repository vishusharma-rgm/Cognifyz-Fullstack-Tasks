import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5100/api/projects";
const emptyForm = { title: "", description: "" };

function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const activeProjects = useMemo(() => projects.length, [projects]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data.data || []);
      setStatus("");
    } catch (error) {
      setStatus("Unable to load projects. Please check the API server.");
    } finally {
      setIsLoading(false);
    }
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openNewProjectModal() {
    setEditingId(null);
    setForm(emptyForm);
    setStatus("");
    setIsModalOpen(true);
  }

  function openEditProjectModal(project) {
    setEditingId(project.id);
    setForm({ title: project.title, description: project.description });
    setStatus("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveProject(event) {
    event.preventDefault();
    setStatus("");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setStatus("Project updated successfully.");
      } else {
        await axios.post(API_URL, form);
        setStatus("Project created successfully.");
      }

      closeModal();
      loadProjects();
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to save project.");
    }
  }

  async function removeProject(projectId) {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      setStatus("Project removed successfully.");
      loadProjects();
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to remove project.");
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-mark">PF</div>
        <div>
          <h1>ProjectFlow</h1>
          <p>Project operations</p>
        </div>
        <nav className="nav-list" aria-label="Dashboard navigation">
          <a className="nav-item active" href="#projects">Projects</a>
          <a className="nav-item" href="#overview">Overview</a>
          <a className="nav-item" href="#reports">Reports</a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Workspace</span>
            <h2>Project Portfolio</h2>
            <p>Track active initiatives and keep delivery details organized.</p>
          </div>
          <button type="button" className="primary-button" onClick={openNewProjectModal}>
            New Project
          </button>
        </header>

        <section className="metrics-grid" aria-label="Project metrics">
          <div className="metric-card">
            <span>Active Projects</span>
            <strong>{activeProjects}</strong>
          </div>
          <div className="metric-card">
            <span>API Status</span>
            <strong>{isLoading ? "Syncing" : "Online"}</strong>
          </div>
          <div className="metric-card">
            <span>Workspace</span>
            <strong>Core Team</strong>
          </div>
        </section>

        {status && <div className="toast">{status}</div>}

        <section className="project-section" id="projects">
          <div className="section-header">
            <div>
              <h3>Projects</h3>
              <p>Review, update, and remove projects from your workspace.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="empty-state">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">No projects yet. Create your first project to begin.</div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="card-accent" />
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="card-actions">
                    <button type="button" className="text-button" onClick={() => openEditProjectModal(project)}>
                      Edit
                    </button>
                    <button type="button" className="danger-button" onClick={() => removeProject(project.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
            <div className="modal-header">
              <div>
                <span className="eyebrow">{editingId ? "Update" : "Create"}</span>
                <h3 id="project-form-title">{editingId ? "Edit Project" : "New Project"}</h3>
              </div>
              <button type="button" className="icon-button" onClick={closeModal} aria-label="Close modal">
                x
              </button>
            </div>
            <form className="project-form" onSubmit={saveProject}>
              <label>
                Title
                <input type="text" name="title" value={form.title} onChange={updateForm} placeholder="Project title" />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Describe the project outcome"
                />
              </label>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
