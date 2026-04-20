import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import HistoryView from './components/HistoryView';
import api from './api';

function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('home');
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isDark = theme === 'dark';

  const colors = {
    bgApp: isDark ? '#111827' : '#f9fafb',
    bgCard: isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    textSubtle: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    taskBg: isDark ? '#374151' : '#f3f4f6',
    overdueBg: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get('tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      margin: 0, padding: 0, fontFamily: 'Segoe UI, system-ui, sans-serif',
      background: colors.bgApp, color: colors.text,
      minHeight: '100vh', transition: 'background 0.3s, color 0.3s'
    }}>
      <Navbar 
        theme={theme} setTheme={setTheme} 
        view={view} setView={setView} 
        colors={colors} 
      />

      {view === 'home' && (
        <div className="app-layout">
          <TaskList 
            tasks={tasks} colors={colors} isDark={isDark} fetchTasks={fetchTasks} 
          />
          <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
          <TaskInput 
            colors={colors} isDark={isDark} fetchTasks={fetchTasks} 
            isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
          />
          <button className="fab-button" onClick={() => setIsSidebarOpen(true)}>+</button>
        </div>
      )}

      {view === 'history' && (
        <HistoryView 
          tasks={tasks} colors={colors} isDark={isDark} 
        />
      )}
    </div>
  );
}

export default App;
