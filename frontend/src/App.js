import React, { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState("home");

  const isDark = theme === "dark";
  const colors = {
    bgApp: isDark ? "#121212" : "#f5f7fb",
    bgCard: isDark ? "#1e1e1e" : "white",
    textMain: isDark ? "#e2e8f0" : "#000",
    textSub: isDark ? "#9ca3af" : "#555",
    border: isDark ? "#333" : "#ddd",
    inputBg: isDark ? "#2a2a2a" : "white",
    overdueBg: isDark ? "#3f1c1c" : "#ffecec",
    taskBg: isDark ? "#252525" : "#f9fafc"
  };

  useEffect(() => {
    fetchTasks(); // first load

    const interval = setInterval(() => {
      fetchTasks(); // refresh every 10 seconds
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  //manisha

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

  { /*listening */ }
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev ? prev + " " + transcript : transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    outline: "none",
    background: colors.inputBg,
    color: colors.textMain,
    colorScheme: isDark ? "dark" : "light"
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
      background: colors.bgApp,
      color: colors.textMain,
      display: "flex",
      justifyContent: "center",
      paddingTop: "100px",
      paddingBottom: "50px",
      fontFamily: "Segoe UI, sans-serif",
      transition: "background 0.3s, color 0.3s"
    }}>
      {/* NAVBAR */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        background: colors.bgCard,
        boxShadow: isDark ? "0 4px 10px rgba(0,0,0,0.5)" : "0 4px 10px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxSizing: "border-box",
        zIndex: 1000,
        transition: "background 0.3s"
      }}>
        <h2 style={{ margin: 0, color: colors.textMain, display: "flex", alignItems: "center", gap: "10px" }}>
          <span>✅</span> TodoApp
        </h2>
        
        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            onClick={() => setView("home")}
            style={{
              background: view === "home" ? "#4f46e5" : "transparent",
              color: view === "home" ? "white" : colors.textMain,
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.2s"
            }}>
            🏠 Home
          </button>
          <button 
            onClick={() => setView("history")}
            style={{
              background: view === "history" ? "#4f46e5" : "transparent",
              color: view === "history" ? "white" : colors.textMain,
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.2s"
            }}>
            📜 History
          </button>
        </div>

        <div>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            style={{
               padding: "6px 12px",
               borderRadius: "6px",
               background: colors.inputBg,
               color: colors.textMain,
               border: `1px solid ${colors.border}`,
               cursor: "pointer",
               outline: "none",
               colorScheme: isDark ? "dark" : "light"
            }}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>
      </nav>

      {view === "home" ? (
      <div style={{
        width: "500px",
        background: colors.bgCard,
        borderRadius: "12px",
        padding: "25px",
        boxShadow: isDark ? "0 8px 25px rgba(0,0,0,0.5)" : "0 8px 25px rgba(0,0,0,0.1)",
        position: "relative",
        transition: "background 0.3s"
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
          {/*button listening*/}
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              placeholder="Description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ ...inputStyle, paddingRight: "40px", boxSizing: "border-box" }}
            />
            <button
              onClick={startListening}
              title="Click to dictate"
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: isListening ? "#ef4444" : "#888",
              }}
            >
              🎙️
            </button>
          </div>
          {/* message */}
          <input
            type="datetime-local"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={inputStyle}
            className="no-calendar-icon"
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
              background: task.is_overdue ? colors.overdueBg : colors.taskBg,
              border: `1px solid ${colors.border}`,
              transition: "0.2s"
            }}>
              <h4 style={{ margin: 0, color: colors.textMain }}>{task.title}</h4>
              <p style={{ margin: "5px 0", color: colors.textSub }}>
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
      ) : (
      <div style={{
        width: "700px",
        background: colors.bgCard,
        borderRadius: "12px",
        padding: "30px",
        boxShadow: isDark ? "0 8px 25px rgba(0,0,0,0.5)" : "0 8px 25px rgba(0,0,0,0.1)",
        transition: "background 0.3s"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📜 Task History</h2>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", gap: "15px" }}>
          <div style={{ flex: 1, textAlign: "center", padding: "20px", background: colors.taskBg, borderRadius: "10px", border: `1px solid ${colors.border}` }}>
            <h3 style={{ margin: 0, color: "#4f46e5" }}>Total Created</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: "10px 0 0 0" }}>{tasks.length}</p>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "20px", background: colors.taskBg, borderRadius: "10px", border: `1px solid ${colors.border}` }}>
            <h3 style={{ margin: 0, color: "#22c55e" }}>Completed</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: "10px 0 0 0" }}>{tasks.filter(t => t.completed).length}</p>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "20px", background: colors.taskBg, borderRadius: "10px", border: `1px solid ${colors.border}` }}>
            <h3 style={{ margin: 0, color: "#ef4444" }}>Overdue</h3>
            <p style={{ fontSize: "28px", fontWeight: "bold", margin: "10px 0 0 0" }}>{tasks.filter(t => t.is_overdue && !t.completed).length}</p>
          </div>
        </div>

        <h3 style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: "10px", marginBottom: "20px", color: colors.textMain }}>All Tasks up to date</h3>
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: colors.textSub }}>No tasks to show in history.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {tasks.map(task => (
              <div key={task.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                background: colors.taskBg,
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                borderLeft: `5px solid ${task.completed ? "#22c55e" : task.is_overdue ? "#ef4444" : "#4f46e5"}`
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "16px", color: colors.textMain }}>{task.title}</h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: colors.textSub }}>
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: task.completed ? (isDark ? "#064e3b" : "#dcfce7") : task.is_overdue ? (isDark ? "#7f1d1d" : "#fee2e2") : (isDark ? "#312e81" : "#e0e7ff"),
                    color: task.completed ? (isDark ? "#34d399" : "#166534") : task.is_overdue ? (isDark ? "#fca5a5" : "#991b1b") : (isDark ? "#818cf8" : "#3730a3")
                  }}>
                    {task.completed ? "Completed" : task.is_overdue ? "Overdue" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;

//abc