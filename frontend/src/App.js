import React, { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
  fetchTasks(); // first load

  const interval = setInterval(() => {
    fetchTasks(); // refresh every 10 seconds
  }, 10000);

  return () => clearInterval(interval);
}, []);

//message from ft branch

  useEffect(() => {
  tasks.forEach(task => {
    if (task.is_overdue && !task.completed) {
      alert(`⚠ Task "${task.title}" is overdue!`);
    }
  });
}, [tasks]);

  const fetchTasks = () => {
    API.get("tasks/")
      .then(res => setTasks(res.data))
      .catch(err => console.log(err));
  };

  const addTask = () => {
    const newTask = {
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      completed: false,
    };

    API.post("tasks/", newTask)
      .then(() => {
        fetchTasks(); // refresh list
        setTitle("");
        setDescription("");
        setDeadline("");
      })
      .catch(err => console.log(err));
  };

  const toggleComplete = (task) => {
  API.put(`tasks/${task.id}/`, {
    ...task,
    completed: !task.completed,
  })
    .then(() => fetchTasks())
    .catch(err => console.log(err));
};

const deleteTask = (id) => {
  API.delete(`tasks/${id}/`)
    .then(() => fetchTasks())
    .catch(err => console.log(err));
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none"
};

const addBtn = {
  width: "100%",
  padding: "10px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const doneBtn = {
  marginRight: "10px",
  padding: "6px 12px",
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

  return (
  <div style={{
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
    fontFamily: "Segoe UI, sans-serif"
  }}>
    <div style={{
      width: "500px",
      background: "white",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
    }}>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        ✨ My Tasks
      </h2>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Description..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={inputStyle}
        />

        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addTask} style={addBtn}>
          + Add Task
        </button>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          No tasks yet 💤
        </p>
      ) : (
        tasks.map(task => (
          <div key={task.id} style={{
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "10px",
            background: task.is_overdue ? "#ffecec" : "#f9fafc",
            border: "1px solid #eee",
            transition: "0.2s"
          }}>
            <h4 style={{ margin: 0 }}>{task.title}</h4>
            <p style={{ margin: "5px 0", color: "#555" }}>
              {task.description}
            </p>

            <p style={{ fontSize: "13px", color: "#888" }}>
              {task.completed ? "✅ Completed" : "⏳ Pending"}
            </p>

            {task.is_overdue && !task.completed && (
              <p style={{ color: "#ff4d4d", fontWeight: "bold" }}>
                ⚠ Overdue
              </p>
            )}

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => toggleComplete(task)} style={doneBtn}>
                {task.completed ? "Undo" : "Done"}
              </button>

              <button onClick={() => deleteTask(task.id)} style={deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}

export default App;

//abc