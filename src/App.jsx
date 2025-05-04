import { useState, useEffect } from 'react';
import './App.css';
import RssFeedView from './components/RssFeedView';
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

  return (
    <div className="App">
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