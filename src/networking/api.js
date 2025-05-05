/**
 * API utility functions for fetching data from various sources
 */

const PROXY_OPTIONS = {
  direct: { name: 'Direct (No Proxy)', url: '' },
  corsAnywhere: { name: 'CORS Anywhere', url: 'https://cors-anywhere.herokuapp.com/' },
  allOrigins: { name: 'All Origins', url: 'https://api.allorigins.win/raw?url=' },
  corsproxy: { name: 'CORS.sh', url: 'https://cors.sh/' }
};

// Apple Music RSS feed types and their display names
export const APPLE_MUSIC_FEED_TYPES = {
  songs: { 
    name: 'Top Songs',
    description: 'Most popular songs on Apple Music'
  },
  albums: { 
    name: 'Top Albums',
    description: 'Best-selling albums on Apple Music'
  },
  'music-videos': { 
    name: 'Music Videos',
    description: 'Popular music videos on Apple Music'
  },
  playlists: { 
    name: 'Featured Playlists',
    description: 'Curated playlists from Apple Music editors'
  }
};

// Available countries for Apple Music RSS feeds
export const APPLE_MUSIC_COUNTRIES = {
  us: 'United States',
  gb: 'United Kingdom',
  jp: 'Japan',
  ca: 'Canada',
  de: 'Germany',
  fr: 'France',
  au: 'Australia',
  br: 'Brazil',
  es: 'Spain',
  it: 'Italy',
  kr: 'South Korea',
  mx: 'Mexico'
};

/**
 * Fetch data from a URL using the specified proxy
 * @param {string} url - The URL to fetch data from
 * @param {string} proxyOption - The proxy option to use
 * @returns {Promise<Object|string>} - The fetched data
 */
export const fetchData = async (url, proxyOption = 'direct') => {
  try {
    // Prepare the URL with the selected proxy
    const proxy = PROXY_OPTIONS[proxyOption];
    
    // Make sure the proxy option exists
    if (proxyOption !== 'direct' && !proxy) {
      console.warn(`Invalid proxy option: ${proxyOption}, falling back to direct`);
      proxyOption = 'direct';
    }
    
    // Prepare the URL based on proxy option
    let fetchUrl;
    if (proxyOption === 'direct') {
      fetchUrl = url;
    } else if (proxyOption === 'allOrigins') {
      fetchUrl = `${PROXY_OPTIONS.allOrigins.url}${encodeURIComponent(url)}`;
    } else {
      fetchUrl = `${proxy.url}${encodeURIComponent(url)}`;
    }
    
    console.log(`Fetching from: ${fetchUrl}`);
    
    // Prepare headers and options
    const options = {
      method: 'GET',
      headers: {},
      cache: 'no-cache',
      credentials: 'omit',
      mode: 'cors',
      timeout: 10000 // 10 second timeout
    };
    
    // Add specific headers for certain proxies
    if (proxyOption === 'corsproxy') {
      options.headers['x-cors-api-key'] = 'temp_me_a_key';
    }
    
    // Use fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    options.signal = controller.signal;
    
    try {
      const res = await fetch(fetchUrl, options);
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}`);
      }
      
      // Clone the response before reading it
      const responseClone = res.clone();
      
      // Try to parse as JSON first
      try {
        const jsonData = await res.json();
        return jsonData;
      } catch (jsonError) {
        console.warn('Failed to parse as JSON, trying as text');
        
        // If not JSON, return as text using the cloned response
        const textData = await responseClone.text();
        
        // If the text looks like JSON, try to parse it manually
        if (textData && (textData.trim().startsWith('{') || textData.trim().startsWith('['))) {
          try {
            return JSON.parse(textData);
          } catch (parseError) {
            console.error('Failed to manually parse text as JSON');
          }
        }
        
        return textData;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out');
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

/**
 * Fetch Apple Music RSS feed
 * @param {Object} options - Feed options
 * @param {string} options.feedType - Type of feed (songs, albums, etc.)
 * @param {string} options.country - Country code (us, gb, etc.)
 * @param {number} options.limit - Number of items to fetch
 * @param {string} options.proxyOption - The proxy option to use
 * @returns {Promise<Object>} - The fetched RSS feed data
 */
export const fetchAppleMusicRSS = async ({
  feedType = 'songs',
  country = 'us',
  limit = 100,
  proxyOption = 'direct' // Use direct by default, as proxies seem to be failing
}) => {
  try {
    // Base URL for Apple Music RSS feeds
    const url = `https://rss.applemarketingtools.com/api/v2/${country}/music/most-played/${limit}/${feedType}.json`;
    console.log(`Fetching Apple Music RSS: ${feedType} for ${country}, limit: ${limit}`);
    
    let responseData = null;
    
    // Try direct fetch first with a simple fetch to avoid CORS issues
    try {
      const directResponse = await fetch(url, { 
        cache: 'no-cache',
        headers: { 'Accept': 'application/json' }
      });
      
      if (directResponse.ok) {
        responseData = await directResponse.json();
        console.log(`Direct fetch successful for ${feedType}`);
      } else {
        throw new Error(`Direct fetch failed with status: ${directResponse.status}`);
      }
    } catch (directError) {
      console.warn(`Direct fetch failed for ${feedType}, trying with proxy`, directError);
      
      try {
        // If direct fetch fails, try with the specified proxy
        responseData = await fetchData(url, 'allOrigins');
        console.log(`Proxy fetch successful for ${feedType}`);
      } catch (proxyError) {
        console.error(`Proxy fetch also failed for ${feedType}`, proxyError);
        
        // Try a different approach with iTunes URL
        try {
          console.log('Trying iTunes URL as last resort');
          const iTunesUrl = `https://itunes.apple.com/${country}/rss/${feedType === 'songs' ? 'topsongs' : feedType}/limit=${limit}/json`;
          responseData = await fetchData(iTunesUrl, 'direct');
          console.log('iTunes URL fetch successful');
        } catch (iTunesError) {
          console.error('All fetch attempts failed', iTunesError);
          throw new Error('Failed to fetch data from all sources');
        }
      }
    }
    
    // Log and validate the response data
    if (responseData) {
      console.log(`Response received for ${feedType}:`, {
        type: typeof responseData,
        hasFeed: !!responseData.feed,
        hasResults: !!(responseData.feed?.results || responseData.results)
      });
      
      // Ensure we have a valid feed structure
      if (!responseData.feed || !responseData.feed.results) {
        console.warn('Fixing feed structure in API response');
        
        // Try to fix the data structure if possible
        if (responseData.results && Array.isArray(responseData.results)) {
          // If the results are directly on the data object
          responseData = { 
            feed: { 
              ...responseData, 
              results: responseData.results,
              title: `${feedType.charAt(0).toUpperCase() + feedType.slice(1)}`,
              updated: new Date().toISOString()
            } 
          };
        } else {
          // Create a minimal structure
          responseData = {
            feed: {
              title: `${feedType.charAt(0).toUpperCase() + feedType.slice(1)}`,
              updated: new Date().toISOString(),
              results: []
            }
          };
        }
      }
      
      return responseData;
    } else {
      console.warn('No data received, creating fallback structure');
      
      // Return a minimal structure instead of throwing an error
      return {
        feed: {
          title: `${feedType.charAt(0).toUpperCase() + feedType.slice(1)}`,
          updated: new Date().toISOString(),
          results: []
        }
      };
    }
  } catch (error) {
    console.error(`Error in fetchAppleMusicRSS for ${feedType}:`, error);
    
    // Create fallback data directly without import
    console.log(`Creating fallback data for ${feedType}`);
    
    // Basic fallback data structure
    const fallbackData = {
      feed: {
        title: `${feedType.charAt(0).toUpperCase() + feedType.slice(1)} (Fallback)`,
        id: `https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/${feedType}.json`,
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
    
    return fallbackData;
  }
};

export { PROXY_OPTIONS };