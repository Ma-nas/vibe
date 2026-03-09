import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLinkById, incrementClicks } from './lib/storage';

export default function Redirect() {
  const { shortId } = useParams<{ shortId: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (shortId) {
      const link = getLinkById(shortId);
      if (link) {
        // Increment the click count
        incrementClicks(shortId);
        // Redirect to the original URL
        window.location.href = link.originalUrl;
      } else {
        setError(true);
      }
    }
  }, [shortId]);

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Link Not Found</h2>
        <p>The shortened link you are trying to access does not exist.</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Go to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
      <div className="loader"></div>
      <h2>Redirecting...</h2>
    </div>
  );
}
