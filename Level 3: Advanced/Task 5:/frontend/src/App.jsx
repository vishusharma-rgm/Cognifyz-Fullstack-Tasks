import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/tasks";
const initialForm = { title: "", description: "" };

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setTasks(result.data || []);
    } catch (error) {
      setMessage("Unable to load tasks. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Request failed");
        return;
      }

      setForm(initialForm);
      setEditingId(null);
      setMessage(editingId ? "Task updated successfully" : "Task created successfully");
      fetchTasks();
    } catch (error) {
      setMessage("Unable to save task");
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({ title: task.title, description: task.description });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initialForm);
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Unable to delete task");
        return;
      }

      setMessage("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      setMessage("Unable to delete task");
    }
  }

  return (
    <main className="app">
      <section className="panel">
        <h1>Task 5 CRUD App</h1>
        <p>React frontend communicating with a Node.js REST API.</p>

        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Task description"
            value={form.description}
            onChange={handleChange}
          />
          <div className="actions">
            <button type="submit">{editingId ? "Update Task" : "Create Task"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="list-section">
        <h2>Tasks</h2>
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                </div>
                <div className="item-actions">
                  <button type="button" onClick={() => startEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="danger" onClick={() => deleteTask(task.id)}>
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
