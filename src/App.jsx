import { useState, useEffect } from 'react';
import './App.css';
import RssFeedView from './components/RssFeedView';
import OfflineNotice from './components/OfflineNotice';
import { 
  fetchAppleMusicRSS, 
  APPLE_MUSIC_FEED_TYPES,
  APPLE_MUSIC_COUNTRIES
} from './networking/api';
import appleLogo from './assets/apple_logo.png';

function App() {
  // RSS feed state
  const [rssData, setRssData] = useState(null);
  const [rssLoading, setRssLoading] = useState(false);
  const [rssError, setRssError] = useState(null);
  const [rssFeedType, setRssFeedType] = useState('songs');
  const [rssCountry, setRssCountry] = useState('us');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Handle PWA install prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      // Update UI to show install button
      setShowInstallButton(true);
    });

    window.addEventListener('appinstalled', () => {
      // Hide the install button when installed
      setShowInstallButton(false);
      console.log('PWA was installed');
    });
  }, []);

  // Load Apple Music RSS feed on initial load or when feed parameters change
  useEffect(() => {
    loadAppleMusicRSS();
  }, [rssFeedType, rssCountry]);

  const handleRssFeedTypeChange = (e) => {
    setRssFeedType(e.target.value);
  };

  const handleRssCountryChange = (e) => {
    setRssCountry(e.target.value);
  };

  const loadAppleMusicRSS = async () => {
    setRssLoading(true);
    setRssError(null);
    
    try {
      const data = await fetchAppleMusicRSS({
        feedType: rssFeedType,
        country: rssCountry,
        limit: 50,
        proxyOption: 'allOrigins' // Always use allOrigins
      });
      setRssData(data);
    } catch (err) {
      console.error('RSS fetch error:', err);
      setRssError(err.message);
    } finally {
      setRssLoading(false);
    }
  };

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
    });
  };

  return (
    <div className="App">
      <OfflineNotice />
      
      <div className="app-sidebar">
        <div className="sidebar-header">
          <img src={appleLogo} alt="Apple Music" className="apple-logo" />
          <h1>Music Charts</h1>
        </div>
        
        <div className="sidebar-content">
          <div className="sidebar-section">
            <h3>Feed Type</h3>
            <div className="feed-type-buttons">
              {Object.entries(APPLE_MUSIC_FEED_TYPES).map(([key, option]) => (
                <button
                  key={key}
                  className={`feed-type-button ${rssFeedType === key ? 'active' : ''}`}
                  onClick={() => setRssFeedType(key)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sidebar-section">
            <h3>Country</h3>
            <select 
              className="country-dropdown"
              value={rssCountry}
              onChange={handleRssCountryChange}
            >
              {Object.entries(APPLE_MUSIC_COUNTRIES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={loadAppleMusicRSS} 
            disabled={rssLoading} 
            className="refresh-button"
          >
            {rssLoading ? (
              <>
                <span className="loading-spinner"></span>
                Loading...
              </>
            ) : (
              <>
                <span className="refresh-icon">↻</span>
                Refresh Charts
              </>
            )}
          </button>
          
          {showInstallButton && (
            <button 
              onClick={handleInstallClick} 
              className="install-button"
            >
              <span className="install-icon">↓</span>
              Install App
            </button>
          )}
        </div>
      </div>
      
      <div className="app-main">
        <div className="main-header">
          <h2>
            {APPLE_MUSIC_FEED_TYPES[rssFeedType]?.name || 'Music Charts'} 
            <span className="country-badge">
              {APPLE_MUSIC_COUNTRIES[rssCountry]}
            </span>
          </h2>
          {rssData && rssData.feed && (
            <p className="last-updated">
              Updated: {new Date(rssData.feed.updated).toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="main-content">
          <RssFeedView 
            rssData={rssData} 
            loading={rssLoading} 
            error={rssError}
            feedType={rssFeedType}
          />
        </div>
      </div>
    </div>
  );
}

export default App;