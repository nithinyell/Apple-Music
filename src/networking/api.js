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
export const fetchData = async (url, proxyOption = 'allOrigins') => {
  // Prepare the URL with the selected proxy
  const proxy = PROXY_OPTIONS[proxyOption];
  const fetchUrl = proxyOption === 'direct' ? url : `${proxy.url}${url}`;
  
  const headers = {};
  
  // Add specific headers for certain proxies
  if (proxyOption === 'corsproxy') {
    headers['x-cors-api-key'] = 'temp_me_a_key'; // Replace with a real key in production
  }
  
  console.log(`Fetching from: ${fetchUrl}`);
  
  const res = await fetch(fetchUrl, { headers });
  
  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }
  
  // Try to parse as JSON first
  try {
    return await res.json();
  } catch (jsonError) {
    // If not JSON, return as text
    return await res.text();
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
  proxyOption = 'allOrigins'
}) => {
  // Base URL for Apple Music RSS feeds
  const url = `https://rss.applemarketingtools.com/api/v2/${country}/music/most-played/${limit}/${feedType}.json`;
  return fetchData(url, proxyOption);
};

export { PROXY_OPTIONS };