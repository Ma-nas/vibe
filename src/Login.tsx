import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getCurrentUser } from './lib/auth';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getCurrentUser()) navigate('/');
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser(username, password)) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '10vh' }}>
      <header className="header">
         <h1><LinkIcon className="icon-header" size={32} /> Login</h1>
      </header>
      <div className="card">
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input className="url-input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="url-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Login</button>
          {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
