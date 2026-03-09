import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLinkById, incrementClicks } from './lib/storage';

export default function Redirect() {
  const { shortId } = useParams<{ shortId: string }>();
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    if (shortId) {
      const link = getLinkById(shortId);
      if (link) {
        // Increment the click count immediately
        incrementClicks(shortId);
        
        // Save the destination so we can show a fallback link
        setDestination(link.originalUrl);

        // Perform the redirect securely. window.location.replace is preferred to prevent back-button loops
        try {
          window.location.replace(link.originalUrl);
        } catch (err) {
          console.error("Redirect failed automatically:", err);
          window.location.href = link.originalUrl;
        }
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
      {destination && (
        <div style={{ marginTop: '2rem' }}>
          <p>If you are not redirected automatically, click below:</p>
          <a href={destination} className="short-url" style={{ display: 'inline-block', marginTop: '10px' }}>
            Continue to {destination}
          </a>
        </div>
      )}
    </div>
  );
}
