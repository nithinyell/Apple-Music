import React, { useState } from 'react';
import '../styles/AlbumCard.css';

const AlbumCard = ({ 
  image, 
  title, 
  artist, 
  album, 
  genres, 
  trackCount, 
  duration, 
  url, 
  releaseDate, 
  description,
  contentAdvisoryRating,
  copyright,
  artistUrl,
  previewUrl
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format duration from milliseconds to mm:ss
  const formatDuration = (ms) => {
    if (!ms) return '';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Format release date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className={`album-card ${showDetails ? 'expanded' : ''}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="album-image-container">
        {image ? (
          <img src={image} alt={title} className="album-image" />
        ) : (
          <div className="album-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        {url && (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="album-link"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="album-link-icon">▶</span>
          </a>
        )}
      </div>
      <div className="album-info">
        <h3 className="album-title">{title || 'Unknown Title'}</h3>
        <p className="album-artist">
          {artistUrl ? (
            <a 
              href={artistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {artist || 'Unknown Artist'}
            </a>
          ) : (
            artist || 'Unknown Artist'
          )}
        </p>
        
        {showDetails && (
          <div className="album-details">
            {album && <p className="album-detail"><span>Album:</span> {album}</p>}
            {genres && <p className="album-detail"><span>Genres:</span> {genres}</p>}
            {trackCount && <p className="album-detail"><span>Tracks:</span> {trackCount}</p>}
            {duration && <p className="album-detail"><span>Duration:</span> {formatDuration(duration)}</p>}
            {releaseDate && <p className="album-detail"><span>Released:</span> {formatDate(releaseDate)}</p>}
            {contentAdvisoryRating && <p className="album-detail"><span>Rating:</span> {contentAdvisoryRating}</p>}
            {copyright && <p className="album-detail"><span>Copyright:</span> {copyright}</p>}
            
            {previewUrl && (
              <div className="album-preview">
                <span>Preview:</span>
                <audio controls src={previewUrl} className="audio-preview" onClick={(e) => e.stopPropagation()}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {description && (
              <div className="album-description">
                <p>{description}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="album-card-footer">
          <span className="details-toggle">
            {showDetails ? 'Hide Details' : 'Show Details'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;