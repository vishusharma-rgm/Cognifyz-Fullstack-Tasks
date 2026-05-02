import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:6000/api";
const emptyAuthForm = { name: "", email: "", password: "" };
const emptyDataForm = { title: "", description: "" };

function App() {
  const [mode, setMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [dataForm, setDataForm] = useState(emptyDataForm);
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("task6Token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("task6User") || "null"));

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const response = await fetch(`${API_URL}/data`);
      const result = await response.json();
      setEntries(result.data || []);
    } catch (error) {
      setMessage("Unable to load entries. Check backend and MongoDB.");
    }
  }

  function updateAuthForm(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function updateDataForm(event) {
    const { name, value } = event.target;
    setDataForm((current) => ({ ...current, [name]: value }));
  }

  async function submitAuth(event) {
    event.preventDefault();
    setMessage("");

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
    const payload =
      mode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Authentication failed");
        return;
      }

      localStorage.setItem("task6Token", result.token);
      localStorage.setItem("task6User", JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
      setAuthForm(emptyAuthForm);
      setMessage(mode === "login" ? "Logged in successfully" : "Account created successfully");
    } catch (error) {
      setMessage("Authentication request failed");
    }
  }

  function logout() {
    localStorage.removeItem("task6Token");
    localStorage.removeItem("task6User");
    setToken("");
    setUser(null);
    setEditingId(null);
    setDataForm(emptyDataForm);
    setMessage("Logged out");
  }

  async function submitData(event) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Please login before creating or editing entries");
      return;
    }

    const url = editingId ? `${API_URL}/data/${editingId}` : `${API_URL}/data`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataForm)
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to save entry");
        return;
      }

      setDataForm(emptyDataForm);
      setEditingId(null);
      setMessage(editingId ? "Entry updated successfully" : "Entry created successfully");
      fetchEntries();
    } catch (error) {
      setMessage("Unable to save entry");
    }
  }

  function startEdit(entry) {
    setEditingId(entry._id);
    setDataForm({ title: entry.title, description: entry.description });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDataForm(emptyDataForm);
  }

  async function deleteEntry(id) {
    if (!token) {
      setMessage("Please login before deleting entries");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/data/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to delete entry");
        return;
      }

      setMessage("Entry deleted successfully");
      fetchEntries();
    } catch (error) {
      setMessage("Unable to delete entry");
    }
  }

  return (
    <main className="app">
      <section className="panel">
        <div className="header-row">
          <div>
            <h1>Task 6 Auth CRUD App</h1>
            <p>MongoDB persistence with JWT-protected create, update, and delete.</p>
          </div>
          {user && (
            <button type="button" className="secondary" onClick={logout}>
              Logout
            </button>
          )}
        </div>

        {!user ? (
          <form className="form" onSubmit={submitAuth}>
            <div className="tabs">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
                Signup
              </button>
            </div>

            {mode === "signup" && (
              <input type="text" name="name" placeholder="Name" value={authForm.name} onChange={updateAuthForm} />
            )}
            <input type="email" name="email" placeholder="Email" value={authForm.email} onChange={updateAuthForm} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authForm.password}
              onChange={updateAuthForm}
            />
            <button type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
          </form>
        ) : (
          <p className="signed-in">Signed in as {user.name} ({user.email})</p>
        )}

        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <h2>{editingId ? "Edit Entry" : "Create Entry"}</h2>
        <form className="form" onSubmit={submitData}>
          <input type="text" name="title" placeholder="Title" value={dataForm.title} onChange={updateDataForm} />
          <textarea
            name="description"
            placeholder="Description"
            value={dataForm.description}
            onChange={updateDataForm}
          />
          <div className="actions">
            <button type="submit">{editingId ? "Update Entry" : "Create Entry"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Data Entries</h2>
        {entries.length === 0 ? (
          <p>No entries found.</p>
        ) : (
          <ul className="entry-list">
            {entries.map((entry) => (
              <li key={entry._id} className="entry-item">
                <div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  {entry.owner && <small>Owner: {entry.owner.name}</small>}
                </div>
                <div className="actions">
                  <button type="button" onClick={() => startEdit(entry)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => deleteEntry(entry._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
