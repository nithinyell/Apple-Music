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
import './styles/SafeArea.css';

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
      const responseData = await fetchAppleMusicRSS({
        feedType: rssFeedType,
        country: rssCountry,
        limit: 50,
        proxyOption: 'direct' // Try direct first, then fall back to proxy if needed
      });
      
      // Check if the data has the expected structure
      if (!responseData) {
        throw new Error('No data received from API');
      }
      
      // Log the data structure to help debug
      console.log(`Received ${rssFeedType} data:`, {
        hasData: !!responseData,
        hasFeed: !!responseData.feed,
        resultsCount: responseData.feed?.results?.length || 'N/A'
      });
      
      // Create a new object to avoid modifying the constant
      let processedData = { ...responseData };
      
      // Ensure we have a valid feed structure
      if (!processedData.feed || !processedData.feed.results || !processedData.feed.results.length) {
        console.warn('Invalid or empty feed structure, attempting to fix');
        
        // Try to fix the data structure if possible
        if (processedData.results && Array.isArray(processedData.results)) {
          // If the results are directly on the data object
          processedData = { feed: { ...processedData, results: processedData.results } };
        } else if (typeof processedData === 'string' && processedData.includes('"results":[')) {
          // If we got a string that looks like JSON
          try {
            const parsed = JSON.parse(processedData);
            processedData = parsed.feed ? parsed : { feed: parsed };
          } catch (parseError) {
            console.error('Failed to parse string data as JSON', parseError);
          }
        }
        
        // If we still don't have valid data, create a minimal structure
        if (!processedData.feed || !processedData.feed.results || !processedData.feed.results.length) {
          console.warn('Creating minimal feed structure');
          // Create a minimal feed structure instead of throwing an error
          processedData = {
            feed: {
              title: `${rssFeedType.charAt(0).toUpperCase() + rssFeedType.slice(1)}`,
              updated: new Date().toISOString(),
              results: []
            }
          };
        }
      }
      
      setRssData(processedData);
    } catch (err) {
      console.error('RSS fetch error:', err);
      setRssError(err.message || 'Failed to load music data');
      
      // Create fallback data directly without import
      console.log(`Creating fallback data for ${rssFeedType}`);
      
      // Basic fallback data structure
      const fallbackData = {
        feed: {
          title: `${rssFeedType.charAt(0).toUpperCase() + rssFeedType.slice(1)} (Fallback)`,
          id: `https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/${rssFeedType}.json`,
          author: { name: "Apple", url: "https://www.apple.com/" },
          updated: new Date().toISOString(),
          results: [
            {
              artistName: "Sample Artist",
              id: Date.now().toString(),
              name: "Sample Song",
              releaseDate: new Date().toISOString().split('T')[0],
              artworkUrl100: "https://via.placeholder.com/100?text=Music",
              genres: [{ name: "Music" }],
              url: "#"
            }
          ]
        }
      };
      
      setRssData(fallbackData);
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