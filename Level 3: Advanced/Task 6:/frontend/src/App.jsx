import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle2, CircleDot, Inbox, LayoutGrid, LockKeyhole, Plus, Search, Settings } from "lucide-react";

const API_URL = "http://localhost:6000/api";
const TOKEN_KEY = "workspaceToken";
const USER_KEY = "workspaceUser";
const statuses = ["Backlog", "In Progress", "Done"];
const emptyAuthForm = { name: "", email: "", password: "" };
const emptyProject = { title: "", description: "", status: "In Progress" };

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projects, setProjects] = useState([]);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY) || "null"));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);
  const grouped = useMemo(
    () => statuses.map((status) => ({ status, projects: projects.filter((project) => project.status === status) })),
    [projects]
  );

  useEffect(() => {
    if (!token || !user) {
      if (window.location.pathname !== "/auth") {
        window.history.replaceState(null, "", "/auth");
      }
      return;
    }

    if (window.location.pathname === "/auth") {
      window.history.replaceState(null, "", "/");
    }

    loadProjects();
  }, [token, user]);

  async function loadProjects() {
    try {
      const response = await axios.get(`${API_URL}/projects`, axiosConfig);
      setProjects(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Session expired. Please sign in again.");
      logout();
    }
  }

  function updateAuthForm(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function validateAuth() {
    if (authMode === "register" && !authForm.name.trim()) return "Name is required";
    if (!authForm.email.trim() || !authForm.email.includes("@")) return "Use a valid email";
    if (authForm.password.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  async function submitAuth(event) {
    event.preventDefault();
    const validation = validateAuth();

    if (validation) {
      toast.error(validation);
      return;
    }

    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    const payload = authMode === "login"
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      setIsTransitioning(true);
      toast.success(authMode === "login" ? `Welcome back, ${response.data.user.name}` : "Account created");

      window.setTimeout(() => {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        setAuthForm(emptyAuthForm);
        setIsTransitioning(false);
      }, 260);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setProjects([]);
    window.history.replaceState(null, "", "/auth");
  }

  async function createProject(event) {
    event.preventDefault();

    try {
      await axios.post(`${API_URL}/projects`, projectForm, axiosConfig);
      setProjectForm(emptyProject);
      toast.success("Project added");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add project");
    }
  }

  async function updateProject(project, updates) {
    const nextProject = { ...project, ...updates };
    setProjects((current) => current.map((item) => (item._id === project._id ? nextProject : item)));

    try {
      await axios.put(`${API_URL}/projects/${project._id}`, nextProject, axiosConfig);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save project");
      loadProjects();
    }
  }

  function updateProjectLocally(projectId, updates) {
    setProjects((current) => current.map((project) => (project._id === projectId ? { ...project, ...updates } : project)));
  }

  async function persistProject(project) {
    try {
      await axios.put(`${API_URL}/projects/${project._id}`, project, axiosConfig);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save project");
      loadProjects();
    }
  }

  async function deleteProject(projectId) {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, axiosConfig);
      toast.success("Project deleted");
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete project");
    }
  }

  if (!user) {
    return (
      <main className={`auth-gateway ${isTransitioning ? "fade-out" : ""}`}>
        <Toaster position="top-center" toastOptions={{ duration: 2600 }} />
        <section className="auth-card" aria-label="Secure gateway">
          <div className="auth-icon"><LockKeyhole size={17} /></div>
          <span className="eyebrow">SECURE GATEWAY</span>
          <h1>Workspace</h1>
          <p>Sign in to continue to your protected project environment.</p>

          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === "register" && (
              <label>
                Name
                <input name="name" value={authForm.name} onChange={updateAuthForm} autoComplete="name" />
              </label>
            )}
            <label>
              Email
              <input name="email" type="email" value={authForm.email} onChange={updateAuthForm} autoComplete="email" />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={updateAuthForm}
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
              />
            </label>
            <button type="submit">{authMode === "login" ? "Sign In" : "Create Account"}</button>
          </form>

          <button
            type="button"
            className="switch-auth"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Need access? Create an account" : "Already have access? Sign in"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="workspace-shell fade-in">
      <Toaster position="top-center" toastOptions={{ duration: 2400 }} />
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><LockKeyhole size={15} /></div>
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
            <span>Search secure workspace</span>
            <kbd>⌘K</kbd>
          </div>
          <button type="button" className="sign-out" onClick={logout}>Sign Out</button>
        </header>

        <section className="page-heading">
          <div>
            <span className="eyebrow">AUTHENTICATED</span>
            <h1>{user.name}'s workspace</h1>
          </div>
          <p>{projects.length} private projects</p>
        </section>

        <form className="quick-add" onSubmit={createProject}>
          <input
            placeholder="Project title"
            value={projectForm.title}
            onChange={(event) => setProjectForm((current) => ({ ...current, title: event.target.value }))}
          />
          <input
            placeholder="Description"
            value={projectForm.description}
            onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
          />
          <button type="submit"><Plus size={15} /> Add Project</button>
        </form>

        <section className="project-board" id="projects">
          {grouped.map((group) => (
            <div className="status-column" key={group.status}>
              <div className="column-header">
                <span className="status-dot" />
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
                    >
                      {project.status === "Done" ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                    </button>
                    <div className="editable-fields">
                      <input
                        value={project.title}
                        onChange={(event) => updateProjectLocally(project._id, { title: event.target.value })}
                        onBlur={(event) => persistProject({ ...project, title: event.target.value })}
                      />
                      <textarea
                        rows="2"
                        value={project.description}
                        onChange={(event) => updateProjectLocally(project._id, { description: event.target.value })}
                        onBlur={(event) => persistProject({ ...project, description: event.target.value })}
                      />
                    </div>
                    <select value={project.status} onChange={(event) => updateProject(project, { status: event.target.value })}>
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <button type="button" className="row-action" onClick={() => deleteProject(project._id)}>Delete</button>
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
