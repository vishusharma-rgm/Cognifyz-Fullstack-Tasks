import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:6000/api";
const TOKEN_KEY = "projectFlowToken";
const USER_KEY = "projectFlowUser";
const emptyAuthForm = { name: "", email: "", password: "" };
const emptyProjectForm = { title: "", description: "" };
const nodePositions = [
  { left: "18%", top: "32%" },
  { left: "48%", top: "22%" },
  { left: "76%", top: "42%" },
  { left: "34%", top: "68%" },
  { left: "66%", top: "70%" }
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showProjectComposer, setShowProjectComposer] = useState(false);
  const [message, setMessage] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [entering, setEntering] = useState(false);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY) || "null"));

  const greeting = useMemo(() => getGreeting(), []);
  const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  useEffect(() => {
    if (token && user) {
      loadProjects();
    }
  }, [token, user]);

  async function loadProjects() {
    try {
      const response = await axios.get(`${API_URL}/projects`, axiosConfig);
      setProjects(response.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Your secure workspace is temporarily unreachable.");
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

  function validateAuth() {
    if (authMode === "signup" && !authForm.name.trim()) return "Name is required.";
    if (!authForm.email.trim() || !authForm.email.includes("@")) return "Use a valid email.";
    if (authForm.password.length < 6) return "Password needs at least 6 characters.";
    return "";
  }

  async function submitAuth(event) {
    event.preventDefault();
    setMessage("");

    const validation = validateAuth();

    if (validation) {
      setMessage(validation);
      return;
    }

    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    const payload = authMode === "login"
      ? { email: authForm.email, password: authForm.password }
      : authForm;

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      setEntering(true);

      window.setTimeout(() => {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        setAuthForm(emptyAuthForm);
        setEntering(false);
      }, 520);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials.");
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setProjects([]);
    setShowProjectComposer(false);
    setProjectForm(emptyProjectForm);
    setEditingId(null);
  }

  function openComposer(project) {
    if (project) {
      setEditingId(project._id);
      setProjectForm({ title: project.title, description: project.description });
    } else {
      setEditingId(null);
      setProjectForm(emptyProjectForm);
    }

    setShowProjectComposer(true);
    setMessage("");
  }

  async function submitProject(event) {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/projects/${editingId}`, projectForm, axiosConfig);
        setMessage("Signal refined.");
      } else {
        await axios.post(`${API_URL}/projects`, projectForm, axiosConfig);
        setMessage("Signal admitted.");
      }

      setShowProjectComposer(false);
      setProjectForm(emptyProjectForm);
      setEditingId(null);
      loadProjects();
    } catch (error) {
      setMessage(error.response?.data?.message || "Complete both fields to continue.");
    }
  }

  async function deleteProject(projectId) {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, axiosConfig);
      setMessage("Signal removed.");
      loadProjects();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to remove signal.");
    }
  }

  if (!user) {
    return (
      <main className={`entry-portal ${focusedField ? "field-focused" : ""} ${entering ? "entering" : ""}`}>
        <div className="light light-one" />
        <div className="light light-two" />
        <section className="entry-card" aria-label="Secure account access">
          <button
            type="button"
            className="quiet-mode"
            onClick={() => {
              setAuthMode(authMode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {authMode === "login" ? "Request access" : "I have access"}
          </button>

          <h1>{greeting}</h1>
          <p>{authMode === "login" ? "Enter quietly." : "Create your private key."}</p>

          <form className="zero-form" onSubmit={submitAuth}>
            {authMode === "signup" && (
              <label className={authForm.name || focusedField === "name" ? "active" : ""}>
                <span>Name</span>
                <input
                  name="name"
                  value={authForm.name}
                  onChange={updateAuthForm}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  autoComplete="name"
                />
              </label>
            )}
            <label className={authForm.email || focusedField === "email" ? "active" : ""}>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={authForm.email}
                onChange={updateAuthForm}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                autoComplete="email"
              />
            </label>
            <label className={authForm.password || focusedField === "password" ? "active" : ""}>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={updateAuthForm}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
              />
            </label>
            {message && <div className="portal-message">{message}</div>}
            <button type="submit" className="tactile-button">
              {authMode === "login" ? "Enter" : "Join"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="secure-canvas">
      <div className="light light-one" />
      <div className="light light-two" />

      <header className="secure-header">
        <button type="button" className="wordmark" onClick={loadProjects}>ProjectFlow</button>
        <div className="secure-actions">
          <button type="button" onClick={() => openComposer()}>+</button>
          <button type="button" onClick={logout}>Exit</button>
        </div>
      </header>

      <section className="secure-copy">
        <span>Private canvas</span>
        <h1>{user.name}'s workspace</h1>
      </section>

      <section className="secure-node-field" aria-label="Protected projects">
        {projects.map((project, index) => {
          const position = nodePositions[index % nodePositions.length];
          return (
            <article className="secure-node" key={project._id} style={position}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div>
                <button type="button" onClick={() => openComposer(project)}>Refine</button>
                <button type="button" onClick={() => deleteProject(project._id)}>Remove</button>
              </div>
            </article>
          );
        })}

        {projects.length === 0 && (
          <button type="button" className="empty-orbit" onClick={() => openComposer()}>
            Admit first signal
          </button>
        )}
      </section>

      {message && <aside className="secure-message">{message}</aside>}

      {showProjectComposer && (
        <section className="composer" aria-label="Project composer">
          <form onSubmit={submitProject}>
            <button type="button" className="close-composer" onClick={() => setShowProjectComposer(false)}>Close</button>
            <label>
              <span>Title</span>
              <textarea
                rows="1"
                name="title"
                value={projectForm.title}
                onChange={updateProjectForm}
                placeholder="Signal name"
              />
            </label>
            <label>
              <span>Description</span>
              <textarea
                rows="4"
                name="description"
                value={projectForm.description}
                onChange={updateProjectForm}
                placeholder="What should this become?"
              />
            </label>
            <button type="submit" className="tactile-button">{editingId ? "Save" : "Admit"}</button>
          </form>
        </section>
      )}
    </main>
  );
}

export default App;
