import React from 'react';
import AlbumCard from './AlbumCard';
import '../styles/AlbumGrid.css';

const AlbumGrid = ({ albums }) => {
  if (!albums || albums.length === 0) {
    return <p className="no-albums">No albums to display</p>;
  }

  return (
    <div className="album-grid">
      {albums.map((album, index) => (
        <AlbumCard
          key={album.id || index}
          image={album.image || album.artwork || album.cover || album.thumbnail}
          title={album.title || album.name}
          artist={album.artist || album.artist_name || album.artistName}
          artistUrl={album.artistUrl}
          album={album.album || album.collectionName}
          genres={album.genres}
          trackCount={album.trackCount}
          duration={album.duration}
          url={album.url}
          releaseDate={album.releaseDate}
          description={album.description || album.editorialNotes}
          contentAdvisoryRating={album.contentAdvisoryRating}
          copyright={album.copyright}
          previewUrl={album.previewUrl}
          recordLabel={album.recordLabel}
        />
      ))}
    </div>
  );
};

export default AlbumGrid;