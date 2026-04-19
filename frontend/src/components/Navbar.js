import React from 'react';

function Navbar({ theme, setTheme, view, setView, colors }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px',
      padding: '0 24px',
      background: colors.bgCard,
      borderBottom: `1px solid ${colors.border}`,
      boxShadow: theme === 'light' ? '0 2px 12px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.4)',
      transition: 'background 0.3s, color 0.3s',
      color: colors.text
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>✅</span> TodoApp
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setView('home')}
          style={{
            background: view === 'home' ? '#4f46e5' : 'transparent',
            color: view === 'home' ? '#fff' : colors.text,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
        >
          Home
        </button>
        <button 
          onClick={() => setView('history')}
          style={{
            background: view === 'history' ? '#4f46e5' : 'transparent',
            color: view === 'history' ? '#fff' : colors.text,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
        >
          History
        </button>
      </div>

      <div>
        <select 
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{
            background: colors.bgApp,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>
    </div>
  );
}

export default Navbar;
