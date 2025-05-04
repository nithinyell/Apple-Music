import React, { useState, useEffect } from 'react';

const OfflineNotice = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-notice">
      <div className="offline-icon">📶</div>
      <div className="offline-message">
        <p>You are currently offline. Some features may be limited.</p>
      </div>
    </div>
  );
};

export default OfflineNotice;