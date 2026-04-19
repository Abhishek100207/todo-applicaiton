import React, { useState } from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, colors, isDark, fetchTasks }) {
  const [filter, setFilter] = useState('All');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const filterBtnStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: '20px',
    border: `1px solid ${active ? '#4f46e5' : colors.border}`,
    background: active ? '#4f46e5' : 'transparent',
    color: active ? '#fff' : colors.textSubtle,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  });

  return (
    <div style={{
      flex: 1,
      background: colors.bgApp,
      padding: '20px 24px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button style={filterBtnStyle(filter === 'All')} onClick={() => setFilter('All')}>All</button>
        <button style={filterBtnStyle(filter === 'Pending')} onClick={() => setFilter('Pending')}>Pending</button>
        <button style={filterBtnStyle(filter === 'Completed')} onClick={() => setFilter('Completed')}>Completed</button>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', color: colors.textSubtle, marginTop: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏝️</div>
          <h3>No tasks found</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              colors={colors} 
              isDark={isDark} 
              fetchTasks={fetchTasks} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
