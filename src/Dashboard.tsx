import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LinkData, addLink, getLinks, toggleLinkStatus, updateDestinationUrl } from './lib/storage';
import { getCurrentUser, logoutUser } from './lib/auth';
import { Copy, Navigation, Link as LinkIcon, AlertCircle, LogOut, Edit2, Settings, Clock, Activity, Power, PowerOff, Save, X } from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [maxClicksInput, setMaxClicksInput] = useState<string>('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const navigate = useNavigate();

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const allLinks = getLinks();
    setLinks(allLinks.filter(l => l.username === currentUser));
  }, [currentUser, navigate]);

  const refreshLinks = () => {
    if(currentUser) {
      setLinks(getLinks().filter(l => l.username === currentUser));
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    let formattedUrl = urlInput.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    let clicksLimit = null;
    if (maxClicksInput.trim() !== '') {
      clicksLimit = parseInt(maxClicksInput, 10);
      if (isNaN(clicksLimit) || clicksLimit < 1) {
        setError('Max clicks must be a valid positive number');
        return;
      }
    }

    if (currentUser) {
      const newLink = addLink(formattedUrl, currentUser, clicksLimit);
      setLinks([newLink, ...links]);
      setUrlInput('');
      setMaxClicksInput('');
    }
  };

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleLinkStatus(id);
    refreshLinks();
  };

  const handleEditClick = (link: LinkData) => {
    setEditingId(link.id);
    setEditUrl(link.originalUrl);
  };

  const handleSaveEdit = (id: string) => {
    let formattedUrl = editUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    if (!isValidUrl(formattedUrl)) {
      alert("Invalid URL");
      return;
    }
    updateDestinationUrl(id, formattedUrl);
    setEditingId(null);
    refreshLinks();
  };

  if (!currentUser) return null;

  return (
    <div className="container">
      <header className="header" style={{ position: 'relative' }}>
        <button 
          onClick={handleLogout} 
          className="btn btn-icon" 
          style={{ position: 'absolute', right: 0, top: 0, color: 'var(--error)' }}
          title="Logout"
        >
          <LogOut size={20} /> Logout
        </button>
        <h1>
          <LinkIcon className="icon-header" size={32} /> Link Analytics Shortener
        </h1>
        <p>Shorten your URLs and manage their behavior instantly.</p>
      </header>

      <main>
        <div className="card form-container">
          <form onSubmit={handleShorten} className="form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <input
                type="text"
                className="url-input"
                placeholder="Paste your long URL here... (e.g., https://example.com/very/long/path)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ alignItems: 'center' }}>
              <input 
                type="number"
                className="url-input" 
                placeholder="Optional: Max Clicks Limit"
                value={maxClicksInput}
                onChange={e => setMaxClicksInput(e.target.value)}
                min="1"
                style={{ flex: '0.4' }}
              />
              <button type="submit" className="btn btn-primary" style={{ flex: '0.6' }}>Shorten & Configure</button>
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={16} /> <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        <div className="dashboard-content">
          <h2>Manage Your Links</h2>
          {links.length === 0 ? (
            <div className="empty-state card">
              <p>You haven't shortened any links yet. Create one above!</p>
            </div>
          ) : (
            <div className="links-grid">
              {links.map((link) => (
                <div key={link.id} className="link-card card" style={{ opacity: link.isActive ? 1 : 0.6 }}>
                  <div className="link-details" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url" style={{ textDecoration: !link.isActive ? 'line-through' : 'none' }}>
                        {link.shortUrl}
                      </a>
                      <span className="badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', background: link.isActive ? 'rgba(158, 206, 106, 0.2)' : 'rgba(247, 118, 142, 0.2)', color: link.isActive ? 'var(--success)' : 'var(--error)'}}>
                        {link.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {editingId === link.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <input 
                          type="text" 
                          className="url-input" 
                          value={editUrl} 
                          onChange={e => setEditUrl(e.target.value)} 
                          style={{ padding: '0.5rem' }}
                        />
                        <button className="btn btn-icon" style={{ color: 'var(--success)' }} onClick={() => handleSaveEdit(link.id)}><Save size={16} /></button>
                        <button className="btn btn-icon" style={{ color: 'var(--error)' }} onClick={() => setEditingId(null)}><X size={16} /></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <p className="original-url" title={link.originalUrl}>
                          {link.originalUrl}
                        </p>
                        <button className="btn-icon-small" onClick={() => handleEditClick(link)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)' }} title="Edit Destination">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                    
                    <div className="meta-info" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> Created: {new Date(link.createdAt).toLocaleString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Activity size={12} /> Last Access: {link.lastAccessedAt ? new Date(link.lastAccessedAt).toLocaleString() : 'Never'}</span>
                      {link.maxClicks && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-primary)' }}><Settings size={12}/> Limit: {link.clicks} / {link.maxClicks}</span>}
                    </div>
                  </div>
                  
                  <div className="link-stats" style={{ paddingTop: '1rem', borderTop: '1px solid var(--card-border)', width: '100%', justifyContent: 'space-between' }}>
                    <div className="stat-box">
                      <Navigation size={18} />
                      <div className="stat-info">
                        <span className="stat-value">{link.clicks}</span>
                        <span className="stat-label">Clicks</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-icon" 
                        onClick={() => handleToggleStatus(link.id)}
                        title={link.isActive ? 'Disable Link' : 'Enable Link'}
                      >
                        {link.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button 
                        className="btn btn-icon" 
                        onClick={() => copyToClipboard(link.shortUrl)}
                        title="Copy to clipboard"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
