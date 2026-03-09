import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getCurrentUser } from './lib/auth';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getCurrentUser()) navigate('/');
  }, [navigate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
       setError('Please fill in all fields');
       return;
    }
    if (registerUser(username, password)) {
      navigate('/login');
    } else {
      setError('Username already taken');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '10vh' }}>
      <header className="header">
         <h1><LinkIcon className="icon-header" size={32} /> Register</h1>
      </header>
      <div className="card">
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input className="url-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="url-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Create Account</button>
          {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
