import React from 'react';

function HistoryView({ tasks, colors, isDark }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => t.is_overdue && !t.completed).length;

  const statCardStyle = {
    flex: 1,
    background: colors.bgCard,
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${colors.border}`,
    boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.08)',
    textAlign: 'center'
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 24px',
      minHeight: 'calc(100vh - 70px)',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ color: colors.text, marginBottom: '24px' }}>Task Analytics</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '8px' }}>{total}</div>
          <div style={{ color: colors.textSubtle, fontSize: '0.9rem' }}>Total Created</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>{completed}</div>
          <div style={{ color: colors.textSubtle, fontSize: '0.9rem' }}>Completed</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>{overdue}</div>
          <div style={{ color: colors.textSubtle, fontSize: '0.9rem' }}>Overdue</div>
        </div>
      </div>

      <h3 style={{ color: colors.text, marginBottom: '16px' }}>All Tasks History</h3>
      
      <div style={{
        background: colors.bgCard,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden'
      }}>
        {tasks.map((task, idx) => {
          let statusBadge = { text: 'Pending', bg: 'rgba(79,70,229,0.1)', color: '#4f46e5', dot: '#4f46e5' };
          if (task.completed) {
            statusBadge = { text: 'Completed', bg: 'rgba(34,197,94,0.1)', color: '#22c55e', dot: '#22c55e' };
          } else if (task.is_overdue) {
            statusBadge = { text: 'Overdue', bg: 'rgba(239,68,68,0.1)', color: '#ef4444', dot: '#ef4444' };
          }

          return (
            <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: idx < tasks.length - 1 ? `1px solid ${colors.border}` : 'none'
            }}>
              <div style={{ color: statusBadge.dot, fontSize: '12px', marginRight: '16px' }}>●</div>
              <div style={{ flex: 1, color: colors.text, fontWeight: '500', textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </div>
              <div style={{ color: colors.textSubtle, fontSize: '0.85rem', width: '180px' }}>
                {task.deadline ? new Date(task.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ''}
              </div>
              <div style={{
                background: statusBadge.bg,
                color: statusBadge.color,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                width: '70px',
                textAlign: 'center'
              }}>
                {statusBadge.text}
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: colors.textSubtle }}>
            No history available.
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryView;
