import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

function TaskCard({ task, colors, isDark, fetchTasks }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStatus = async () => {
    try {
      await api.put(`tasks/${task.id}/`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`tasks/${task.id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`tasks/${task.id}/`, { ...task, title: editTitle, description: editDesc });
      setEditMode(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDeadline = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  };

  let statusColor = '#4f46e5'; // Pending
  if (task.completed) statusColor = '#22c55e';
  else if (task.is_overdue) statusColor = '#ef4444';

  let cardBg = colors.bgCard;
  if (task.completed) {
      cardBg = isDark ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.05)';
  } else if (task.is_overdue) {
      cardBg = isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)';
  }

  if (editMode) {
    return (
      <div style={{
        background: colors.bgCard,
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        <input 
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: colors.bgApp, color: colors.text, outline: 'none' }}
          value={editTitle} onChange={e => setEditTitle(e.target.value)} 
        />
        <textarea 
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: colors.bgApp, color: colors.text, minHeight: '60px', outline: 'none' }}
          value={editDesc} onChange={e => setEditDesc(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={() => setEditMode(false)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSaveEdit} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: cardBg,
      padding: '16px',
      borderRadius: '12px',
      border: `1px solid ${task.is_overdue && !task.completed ? '#ef4444' : colors.border}`,
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)',
      opacity: task.completed ? 0.7 : 1,
      transition: 'all 0.3s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ color: statusColor, fontSize: '20px', marginTop: '-2px' }}>●</div>
          <div>
            <h3 style={{ 
              margin: '0 0 4px 0', 
              fontSize: '1rem', 
              color: colors.text,
              textDecoration: task.completed ? 'line-through' : 'none'
            }}>
              {task.title}
            </h3>
            {task.description && (
              <p style={{
                margin: '0 0 12px 0',
                color: colors.textSubtle,
                fontSize: '0.9rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {task.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: colors.textSubtle }}>
                <span>🕐</span> {formatDeadline(task.deadline)}
              </div>
              {task.is_overdue && !task.completed && (
                <div style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                  ⚠ Overdue
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ background: 'transparent', border: 'none', color: colors.textSubtle, cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}
            >
              ⋮
            </button>
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '24px',
                zIndex: 100,
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                minWidth: '140px',
                overflow: 'hidden'
              }}>
                <div 
                  onClick={() => { setEditMode(true); setDropdownOpen(false); }}
                  style={{ padding: '10px 16px', cursor: 'pointer', color: colors.text, fontSize: '0.9rem', borderBottom: `1px solid ${colors.border}` }}
                >
                  ✏️ Edit
                </div>
                <div 
                  onClick={() => { handleDelete(); setDropdownOpen(false); }}
                  style={{ padding: '10px 16px', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem' }}
                >
                  🗑 Delete
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleStatus}
            style={{
              background: task.completed ? 'transparent' : '#22c55e',
              border: task.completed ? `1px solid ${colors.border}` : 'none',
              color: task.completed ? colors.textSubtle : '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}
          >
            {task.completed ? 'Undo' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
