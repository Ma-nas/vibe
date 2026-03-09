import React, { useState, useEffect } from 'react';
import { addLink, getLinks, type LinkData } from './lib/storage';
import { Copy, Navigation, Link as LinkIcon, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLinks(getLinks());
  }, []);

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

    const newLink = addLink(formattedUrl);
    setLinks([newLink, ...links]);
    setUrlInput('');
  };

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>
          <LinkIcon className="icon-header" size={32} /> Link Analytics Shortener
        </h1>
        <p>Shorten your URLs and track their performance instantly.</p>
      </header>

      <main>
        <div className="card form-container">
          <form onSubmit={handleShorten} className="form">
            <div className="input-group">
              <input
                type="text"
                className="url-input"
                placeholder="Paste your long URL here... (e.g., https://example.com/very/long/path)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Shorten</button>
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={16} /> <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        <div className="dashboard-content">
          <h2>Your Links</h2>
          {links.length === 0 ? (
            <div className="empty-state card">
              <p>You haven't shortened any links yet. Create one above!</p>
            </div>
          ) : (
            <div className="links-grid">
              {links.map((link) => (
                <div key={link.id} className="link-card card">
                  <div className="link-details">
                    <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="short-url">
                      {link.shortUrl}
                    </a>
                    <p className="original-url" title={link.originalUrl}>
                      {link.originalUrl}
                    </p>
                    <span className="date">Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="link-stats">
                    <div className="stat-box">
                      <Navigation size={20} />
                      <div className="stat-info">
                        <span className="stat-value">{link.clicks}</span>
                        <span className="stat-label">Clicks</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-icon" 
                      onClick={() => copyToClipboard(link.shortUrl)}
                      title="Copy to clipboard"
                    >
                      <Copy size={18} />
                    </button>
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
