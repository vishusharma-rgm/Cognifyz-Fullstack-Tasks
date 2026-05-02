import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:6000/api";
const TOKEN_KEY = "projectFlowToken";
const USER_KEY = "projectFlowUser";
const emptyAuthForm = { name: "", email: "", password: "" };
const emptyProjectForm = { title: "", description: "" };

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY) || "null"));

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` }
    }),
    [token]
  );

  useEffect(() => {
    if (token) {
      loadProjects();
    }
  }, [token]);

  async function loadProjects() {
    try {
      const response = await axios.get(`${API_URL}/projects`, axiosConfig);
      setProjects(response.data.data || []);
    } catch (error) {
      setToast(error.response?.data?.message || "Unable to load your workspace.");
    }
  }

  function updateAuthForm(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function updateProjectForm(event) {
    const { name, value } = event.target;
    setProjectForm((current) => ({ ...current, [name]: value }));
  }

  function validateAuthForm() {
    if (authMode === "signup" && !authForm.name.trim()) {
      return "Name is required.";
    }

    if (!authForm.email.trim()) {
      return "Email is required.";
    }

    if (!authForm.email.includes("@")) {
      return "Enter a valid email address.";
    }

    if (authForm.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  }

  async function submitAuth(event) {
    event.preventDefault();
    setToast("");

    const validationError = validateAuthForm();

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError("");

    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    const payload =
      authMode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      setToken(response.data.token);
      setUser(response.data.user);
      setAuthForm(emptyAuthForm);
      setToast(authMode === "login" ? "Welcome back." : "Account created successfully.");
    } catch (error) {
      setToast(error.response?.data?.message || "Invalid credentials.");
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setProjects([]);
    setProjectForm(emptyProjectForm);
    setEditingId(null);
    setIsProjectFormOpen(false);
    setToast("Signed out successfully.");
  }

  function openCreateForm() {
    setEditingId(null);
    setProjectForm(emptyProjectForm);
    setIsProjectFormOpen(true);
    setToast("");
  }

  function openEditForm(project) {
    setEditingId(project._id);
    setProjectForm({ title: project.title, description: project.description });
    setIsProjectFormOpen(true);
    setToast("");
  }

  function closeProjectForm() {
    setEditingId(null);
    setProjectForm(emptyProjectForm);
    setIsProjectFormOpen(false);
  }

  async function submitProject(event) {
    event.preventDefault();
    setToast("");

    try {
      if (editingId) {
        await axios.put(`${API_URL}/projects/${editingId}`, projectForm, axiosConfig);
        setToast("Project updated.");
      } else {
        await axios.post(`${API_URL}/projects`, projectForm, axiosConfig);
        setToast("Project created.");
      }

      closeProjectForm();
      loadProjects();
    } catch (error) {
      setToast(error.response?.data?.message || "Unable to save project.");
    }
  }

  async function deleteProject(projectId) {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, axiosConfig);
      setToast("Project deleted.");
      loadProjects();
    } catch (error) {
      setToast(error.response?.data?.message || "Unable to delete project.");
    }
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-brand">ProjectFlow</div>
          <span className="eyebrow">Account Access</span>
          <h1>{authMode === "login" ? "Member Login" : "Create Account"}</h1>
          <p>Access your private project workspace with secure authentication.</p>

          <div className="mode-switch">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => {
                setAuthMode("login");
                setFieldError("");
                setToast("");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={authMode === "signup" ? "active" : ""}
              onClick={() => {
                setAuthMode("signup");
                setFieldError("");
                setToast("");
              }}
            >
              Sign Up
            </button>
          </div>

          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === "signup" && (
              <label>
                Name
                <input type="text" name="name" value={authForm.name} onChange={updateAuthForm} placeholder="Your name" />
              </label>
            )}
            <label>
              Email
              <input type="email" name="email" value={authForm.email} onChange={updateAuthForm} placeholder="name@company.com" />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={updateAuthForm}
                placeholder="Minimum 6 characters"
              />
            </label>
            {fieldError && <div className="error-toast">{fieldError}</div>}
            {toast && <div className="error-toast">{toast}</div>}
            <button type="submit" className="primary-button">
              {authMode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="portal-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">PF</div>
          <div>
            <h1>ProjectFlow</h1>
            <p>Secure workspace</p>
          </div>
        </div>
        <nav className="nav-list" aria-label="Workspace navigation">
          <a className="nav-item active" href="#projects">Projects</a>
          <a className="nav-item" href="#security">Security</a>
          <a className="nav-item" href="#settings">Settings</a>
        </nav>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">Private Workspace</span>
            <h2>Welcome, {user.name}</h2>
            <p>Your projects are protected and visible only to your account.</p>
          </div>
          <div className="header-actions">
            <button type="button" className="secondary-button" onClick={logout}>Sign Out</button>
            <button type="button" className="primary-button" onClick={openCreateForm}>New Project</button>
          </div>
        </header>

        {toast && <div className="success-toast">{toast}</div>}

        {isProjectFormOpen && (
          <section className="form-panel">
            <div>
              <span className="eyebrow">{editingId ? "Update" : "Create"}</span>
              <h3>{editingId ? "Edit Project" : "New Project"}</h3>
            </div>
            <form className="project-form" onSubmit={submitProject}>
              <label>
                Title
                <input type="text" name="title" value={projectForm.title} onChange={updateProjectForm} placeholder="Project title" />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={updateProjectForm}
                  placeholder="Define the project scope"
                />
              </label>
              <div className="form-actions">
                <button type="button" className="secondary-button" onClick={closeProjectForm}>Cancel</button>
                <button type="submit" className="primary-button">{editingId ? "Save Changes" : "Create Project"}</button>
              </div>
            </form>
          </section>
        )}

        <section className="project-section" id="projects">
          <div className="section-header">
            <div>
              <h3>My Projects</h3>
              <p>Only projects created by your account appear here.</p>
            </div>
            <strong>{projects.length} total</strong>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">No projects yet. Create a project to start building your workspace.</div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project._id}>
                  <div className="card-accent" />
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="card-actions">
                    <button type="button" className="text-button" onClick={() => openEditForm(project)}>Edit</button>
                    <button type="button" className="danger-button" onClick={() => deleteProject(project._id)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
