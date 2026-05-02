import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5100/api/projects";
const emptyProject = { title: "", description: "" };
const nodePositions = [
  { left: "14%", top: "29%" },
  { left: "45%", top: "18%" },
  { left: "70%", top: "37%" },
  { left: "28%", top: "64%" },
  { left: "61%", top: "70%" },
  { left: "82%", top: "58%" }
];

function App() {
  const [projects, setProjects] = useState([]);
  const [draft, setDraft] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [dockActive, setDockActive] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const constellationLines = useMemo(() => projects.slice(0, 6), [projects]);

  useEffect(() => {
    loadProjects();
  }, []);

  function revealDock(event) {
    const nearBottom = window.innerHeight - event.clientY < 170;
    const nearLeft = event.clientX < 130;
    setDockActive(nearBottom || nearLeft);
  }

  async function loadProjects() {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data.data || []);
      setNotice("");
    } catch (error) {
      setNotice("Project stream unavailable. Start the API to reconnect the canvas.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateOverlay() {
    setEditingId(null);
    setDraft(emptyProject);
    setOverlayOpen(true);
    setNotice("");
  }

  function openEditOverlay(project) {
    setEditingId(project.id);
    setDraft({ title: project.title, description: project.description });
    setOverlayOpen(true);
    setNotice("");
  }

  function closeOverlay() {
    setOverlayOpen(false);
    setEditingId(null);
    setDraft(emptyProject);
  }

  async function saveProject(event) {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, draft);
        setNotice("Node refined.");
      } else {
        await axios.post(API_URL, draft);
        setNotice("New signal added to the canvas.");
      }

      closeOverlay();
      loadProjects();
    } catch (error) {
      setNotice(error.response?.data?.message || "The canvas rejected incomplete data.");
    }
  }

  async function deleteProject(projectId) {
    try {
      await axios.delete(`${API_URL}/${projectId}`);
      setNotice("Node dissolved.");
      loadProjects();
    } catch (error) {
      setNotice(error.response?.data?.message || "Unable to dissolve this node.");
    }
  }

  return (
    <main className="workspace-canvas" onMouseMove={revealDock}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grain" />

      <header className="canvas-header">
        <button type="button" className="wordmark" onClick={() => setDockActive(true)}>
          ProjectFlow
        </button>
        <div className="canvas-meta">
          <span>{loading ? "Syncing" : "Live workspace"}</span>
          <strong>{projects.length.toString().padStart(2, "0")}</strong>
        </div>
      </header>

      <section className="hero-copy" aria-label="Workspace summary">
        <span>Flexible canvas</span>
        <h1>Shape work as signals, not boxes.</h1>
      </section>

      <section className="node-field" aria-label="Project canvas">
        <svg className="connection-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {constellationLines.slice(0, -1).map((project, index) => {
            const current = nodePositions[index % nodePositions.length];
            const next = nodePositions[(index + 1) % nodePositions.length];
            return (
              <line
                key={project.id}
                x1={parseFloat(current.left)}
                y1={parseFloat(current.top)}
                x2={parseFloat(next.left)}
                y2={parseFloat(next.top)}
              />
            );
          })}
        </svg>

        {projects.map((project, index) => {
          const position = nodePositions[index % nodePositions.length];
          return (
            <article
              className="project-node"
              key={project.id}
              style={{ left: position.left, top: position.top, animationDelay: `${index * 90}ms` }}
            >
              <div className="node-pulse" />
              <div className="node-content">
                <span>Signal {String(index + 1).padStart(2, "0")}</span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="node-actions">
                  <button type="button" onClick={() => openEditOverlay(project)}>Refine</button>
                  <button type="button" onClick={() => deleteProject(project.id)}>Dissolve</button>
                </div>
              </div>
            </article>
          );
        })}

        {!loading && projects.length === 0 && (
          <button type="button" className="empty-orbit" onClick={openCreateOverlay}>
            Add the first signal
          </button>
        )}
      </section>

      {notice && <aside className="soft-notice">{notice}</aside>}

      <nav className={`edge-dock ${dockActive ? "active" : ""}`} aria-label="Canvas controls">
        <button type="button" onClick={openCreateOverlay} aria-label="New project">+</button>
        <button type="button" onClick={loadProjects} aria-label="Refresh canvas">sync</button>
        <button type="button" onClick={() => setDockActive(false)} aria-label="Hide controls">min</button>
      </nav>

      {overlayOpen && (
        <section className="ingestion-overlay" aria-labelledby="ingestion-title">
          <div className="overlay-orbit" />
          <form className="ingestion-panel" onSubmit={saveProject}>
            <span>{editingId ? "Refine signal" : "New signal"}</span>
            <label id="ingestion-title">
              <small>Project title</small>
              <textarea
                rows="1"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                placeholder="Give the work a name"
              />
            </label>
            <label>
              <small>Project brief</small>
              <textarea
                rows="4"
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                placeholder="Describe what this signal is moving toward"
              />
            </label>
            <div className="overlay-actions">
              <button type="button" onClick={closeOverlay}>Release</button>
              <button type="submit">{editingId ? "Save motion" : "Add to canvas"}</button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

export default App;
