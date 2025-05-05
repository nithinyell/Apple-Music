import React from 'react';
import AlbumGrid from './AlbumGrid';
import '../styles/RssFeedView.css';
import { APPLE_MUSIC_FEED_TYPES } from '../networking/api';

const RssFeedView = ({ rssData, loading, error, feedType }) => {
  if (loading) {
    return (
      <div className="rss-loading">
        <div className="loader-animation"></div>
        <p>Loading music charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rss-error">
        <div className="error-icon">!</div>
        <div className="error-content">
          <h3>Error loading music charts</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!rssData) {
    return <div className="rss-empty">No music data available</div>;
  }

  // Extract feed information - handle both direct and nested formats
  let feed, results;
  
  try {
    // Check if the response is already in the expected format
    if (rssData && rssData.feed) {
      feed = rssData.feed;
    } else if (rssData) {
      // If not, the response might be the feed itself
      feed = rssData;
    } else {
      throw new Error('No data available');
    }
    
    if (!feed) {
      throw new Error('Invalid feed format');
    }

    // Extract results/items from the feed
    results = feed.results;
    if (!results || results.length === 0) {
      throw new Error('No items in the feed');
    }
  } catch (err) {
    console.error('Feed processing error:', err.message, rssData);
    return <div className="rss-empty">{err.message || 'Error processing feed data'}</div>;
  }

  // Transform the RSS data to match our album card format based on feed type
  const albums = results.map(item => {
    // Use higher resolution artwork if available
    const image = item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl100;
    
    // Base mapping that works for most feed types
    const baseMapping = {
      id: item.id,
      title: item.name,
      artist: item.artistName,
      artistUrl: item.artistUrl,
      image: image,
      url: item.url,
      releaseDate: item.releaseDate,
      copyright: item.copyright,
      contentAdvisoryRating: item.contentAdvisoryRating,
      genres: item.genres?.map(g => g.name).join(', ')
    };

    // Add feed-type specific properties
    switch (feedType) {
      case 'playlists':
        return {
          ...baseMapping,
          // For playlists, use the curator name as the "artist"
          artist: item.curatorName || 'Apple Music',
          artistUrl: item.curatorUrl,
          // Add playlist-specific properties
          description: item.description?.standard || item.description,
          trackCount: item.trackCount,
          playlistType: item.kind
        };
      
      case 'music-videos':
        return {
          ...baseMapping,
          // Add video-specific properties
          previewUrl: item.previews?.[0]?.url,
          duration: item.duration,
          album: item.collectionName
        };
        
      case 'albums':
        return {
          ...baseMapping,
          // Add album-specific properties
          releaseDate: item.releaseDate,
          trackCount: item.trackCount,
          recordLabel: item.recordLabel,
          copyright: item.copyright,
          description: item.editorialNotes?.standard || item.editorialNotes?.short
        };
        
      case 'songs':
      default:
        return {
          ...baseMapping,
          // Add song-specific properties
          album: item.collectionName,
          duration: item.duration,
          previewUrl: item.previews?.[0]?.url,
          isrc: item.isrc
        };
    }
  });

  return (
    <div className="rss-feed-view" data-feed-type={feedType}>
      <AlbumGrid albums={albums} />
      {/* Debug info - remove in production */}
      {/* <div style={{display: 'none'}}>
        <pre>{JSON.stringify({feedType, feedStructure: feed ? 'Has feed' : 'No feed', resultsCount: results?.length || 0}, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default RssFeedView;