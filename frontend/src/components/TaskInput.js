import React, { useState, useEffect, useRef } from 'react';
import api, { suggestDescription, enhanceDescription } from '../api';

function TaskInput({ colors, isDark, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [enhancing, setEnhancing] = useState(false);
  const [listening, setListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const debounceTimeout = useRef(null);

  // Suggestions Debounce
  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (val.trim().length > 3) {
      debounceTimeout.current = setTimeout(async () => {
        const sugs = await suggestDescription(val);
        setSuggestions(sugs);
      }, 400);
    } else {
      setSuggestions([]);
    }
  };

  const handleEnhance = async () => {
    if (!description.trim()) return;
    setEnhancing(true);
    try {
      const enhanced = await enhanceDescription(description);
      setDescription(enhanced);
    } catch (e) {
      setErrorMsg('Failed to enhance');
      setTimeout(() => setErrorMsg(''), 2000);
    }
    setEnhancing(false);
  };

  const handleSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setErrorMsg('Speech API not supported');
        setTimeout(() => setErrorMsg(''), 2000);
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    let deadline = null;
    if (date && time) {
        deadline = new Date(`${date}T${time}`).toISOString();
    } else if (date) {
        deadline = new Date(`${date}T00:00:00`).toISOString();
    } else {
        // default deadline 1 hour from now if none provided to pass DRF validation
        let d = new Date();
        d.setHours(d.getHours() + 1);
        deadline = d.toISOString();
    }

    try {
      await api.post('tasks/', {
        title: title.trim(),
        description: description.trim(),
        deadline
      });
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setSuggestions([]);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: colors.bgApp,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    borderRadius: '8px',
    marginBottom: '16px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      width: '340px',
      minWidth: '340px',
      height: '100%',
      background: colors.bgCard,
      borderLeft: `1px solid ${colors.border}`,
      padding: '24px',
      overflowY: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: colors.text }}>New Task</h2>
      
      <input 
        style={inputStyle}
        type="text"
        placeholder="Task title…"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <div style={{ position: 'relative', marginBottom: suggestions.length > 0 ? '8px' : '16px' }}>
        <textarea
          style={{
            ...inputStyle,
            minHeight: '120px',
            marginBottom: '0',
            resize: 'vertical',
            paddingRight: '40px'
          }}
          placeholder="Describe your task…"
          value={description}
          onChange={handleDescriptionChange}
        />
        <button
          onClick={handleSpeech}
          title="Voice input"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: listening ? '#ef4444' : colors.textSubtle,
            fontSize: '18px'
          }}
        >
          🎙
        </button>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
             <button
                onClick={handleEnhance}
                disabled={enhancing || !description.trim()}
                style={{
                    border: '1px solid #4f46e5',
                    color: '#4f46e5',
                    background: 'transparent',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    cursor: (enhancing || !description.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (enhancing || !description.trim()) ? 0.5 : 1
                }}
             >
                 {enhancing ? 'Enhancing...' : '✨ Enhance with AI'}
             </button>
        </div>
        
        {errorMsg && <div style={{color: '#ef4444', fontSize: '12px', textAlign: 'right', marginTop: '4px'}}>{errorMsg}</div>}
      </div>

      {suggestions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {suggestions.map((sug, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setDescription(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + sug);
                setSuggestions([]);
              }}
              style={{
                background: isDark ? '#374151' : '#f3f4f6',
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                color: colors.text
              }}
            >
              {sug}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="date"
          style={{...inputStyle, marginBottom: 0, flex: 1}}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input 
          type="time"
          style={{...inputStyle, marginBottom: 0, flex: 1}}
          value={time}
          onChange={e => setTime(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        style={{
          width: '100%',
          padding: '12px',
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: title.trim() ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          opacity: title.trim() ? 1 : 0.6,
          transition: 'opacity 0.2s'
        }}
      >
        ＋ Add Task
      </button>
    </div>
  );
}

export default TaskInput;
