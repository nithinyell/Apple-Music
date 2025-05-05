/**
 * Fallback data for when the API fails
 * This ensures the app can still function and display something to the user
 */

export const fallbackSongs = {
  feed: {
    title: "Top Songs (Fallback)",
    id: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json",
    author: { name: "Apple", url: "https://www.apple.com/" },
    links: [{ self: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json" }],
    copyright: "Copyright © 2023 Apple Inc. All rights reserved.",
    country: "us",
    icon: "https://www.apple.com/favicon.ico",
    updated: new Date().toISOString(),
    results: [
      {
        artistName: "Drake",
        id: "1796127375",
        name: "NOKIA",
        releaseDate: "2023-02-14",
        kind: "songs",
        artistId: "271256",
        artistUrl: "https://music.apple.com/us/artist/drake/271256",
        contentAdvisoryRating: "Explicit",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/34/10/1e/34101e1f-f4b9-907a-ce47-3fba5b3ee5e8/50222.jpg/100x100bb.jpg",
        genres: [{ genreId: "15", name: "R&B/Soul" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/album/nokia/1796127242?i=1796127375"
      },
      {
        artistName: "Kendrick Lamar",
        id: "1744776167",
        name: "Not Like Us",
        releaseDate: "2023-05-04",
        kind: "songs",
        artistId: "368183298",
        artistUrl: "https://music.apple.com/us/artist/kendrick-lamar/368183298",
        contentAdvisoryRating: "Explicit",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/ef/b6/d0efb685-73be-fdee-58c9-be655f4cd4fd/24UMGIM51924.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "18", name: "Hip-Hop/Rap" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/album/not-like-us/1744776162?i=1744776167"
      },
      {
        artistName: "Lady Gaga & Bruno Mars",
        id: "1762656732",
        name: "Die With A Smile",
        releaseDate: "2023-08-16",
        kind: "songs",
        artistId: "277293880",
        artistUrl: "https://music.apple.com/us/artist/lady-gaga/277293880",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "14", name: "Pop" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/album/die-with-a-smile/1762656724?i=1762656732"
      }
    ]
  }
};

export const fallbackAlbums = {
  feed: {
    title: "Top Albums (Fallback)",
    id: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/albums.json",
    author: { name: "Apple", url: "https://www.apple.com/" },
    links: [{ self: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/albums.json" }],
    copyright: "Copyright © 2023 Apple Inc. All rights reserved.",
    country: "us",
    icon: "https://www.apple.com/favicon.ico",
    updated: new Date().toISOString(),
    results: [
      {
        artistName: "Taylor Swift",
        id: "1713575456",
        name: "The Tortured Poets Department",
        releaseDate: "2023-04-19",
        kind: "albums",
        artistId: "159260351",
        artistUrl: "https://music.apple.com/us/artist/taylor-swift/159260351",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8e/b6/23/8eb623f9-b0d7-0d0e-8b2a-5d145e7cf9cf/23UM1IM46882.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "14", name: "Pop" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/album/the-tortured-poets-department/1713575456",
        contentAdvisoryRating: "Explicit"
      },
      {
        artistName: "Morgan Wallen",
        id: "1667991171",
        name: "One Thing At A Time",
        releaseDate: "2023-03-03",
        kind: "albums",
        artistId: "829142092",
        artistUrl: "https://music.apple.com/us/artist/morgan-wallen/829142092",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/86/cc/00/86cc001c-2efc-9ebb-8290-17f4f3ba3e4a/23UMGIM08087.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "6", name: "Country" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/album/one-thing-at-a-time/1667990565",
        contentAdvisoryRating: "Explicit"
      }
    ]
  }
};

export const fallbackPlaylists = {
  feed: {
    title: "Top Playlists (Fallback)",
    id: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/playlists.json",
    author: { name: "Apple", url: "https://www.apple.com/" },
    links: [{ self: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/playlists.json" }],
    copyright: "Copyright © 2023 Apple Inc. All rights reserved.",
    country: "us",
    icon: "https://www.apple.com/favicon.ico",
    updated: new Date().toISOString(),
    results: [
      {
        id: "pl.a5ef67f3dde74a0b9930944b2f74e9b5",
        name: "Today's Hits",
        curatorName: "Apple Music",
        curatorUrl: "https://music.apple.com/us/curator/apple-music/976439526",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Features116/v4/77/5a/c7/775ac764-9c2e-2d2a-e022-f8bc9ec6ae3e/source/100x100bb.jpg",
        url: "https://music.apple.com/us/playlist/todays-hits/pl.a5ef67f3dde74a0b9930944b2f74e9b5",
        description: { standard: "The songs everyone is listening to right now." }
      },
      {
        id: "pl.f4d106fed2bd41149aaacabb233eb5eb",
        name: "Hip-Hop Hits",
        curatorName: "Apple Music",
        curatorUrl: "https://music.apple.com/us/curator/apple-music/976439526",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Features126/v4/0c/e6/92/0ce6928b-9eb6-3666-24f4-084c9c0e72a0/source/100x100bb.jpg",
        url: "https://music.apple.com/us/playlist/hip-hop-hits/pl.f4d106fed2bd41149aaacabb233eb5eb",
        description: { standard: "The biggest hip-hop songs of the moment." }
      }
    ]
  }
};

export const fallbackMusicVideos = {
  feed: {
    title: "Top Music Videos (Fallback)",
    id: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/music-videos.json",
    author: { name: "Apple", url: "https://www.apple.com/" },
    links: [{ self: "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/music-videos.json" }],
    copyright: "Copyright © 2023 Apple Inc. All rights reserved.",
    country: "us",
    icon: "https://www.apple.com/favicon.ico",
    updated: new Date().toISOString(),
    results: [
      {
        artistName: "Billie Eilish",
        id: "1739659144",
        name: "WILDFLOWER",
        releaseDate: "2023-05-17",
        kind: "music-videos",
        artistId: "1065981054",
        artistUrl: "https://music.apple.com/us/artist/billie-eilish/1065981054",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "20", name: "Alternative" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/music-video/wildflower/1739659144"
      },
      {
        artistName: "Kendrick Lamar",
        id: "1744776167",
        name: "Not Like Us",
        releaseDate: "2023-05-04",
        kind: "music-videos",
        artistId: "368183298",
        artistUrl: "https://music.apple.com/us/artist/kendrick-lamar/368183298",
        contentAdvisoryRating: "Explicit",
        artworkUrl100: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d0/ef/b6/d0efb685-73be-fdee-58c9-be655f4cd4fd/24UMGIM51924.rgb.jpg/100x100bb.jpg",
        genres: [{ genreId: "18", name: "Hip-Hop/Rap" }, { genreId: "34", name: "Music" }],
        url: "https://music.apple.com/us/music-video/not-like-us/1744776167"
      }
    ]
  }
};

export const getFallbackData = (feedType) => {
  switch (feedType) {
    case 'songs':
      return fallbackSongs;
    case 'albums':
      return fallbackAlbums;
    case 'playlists':
      return fallbackPlaylists;
    case 'music-videos':
      return fallbackMusicVideos;
    default:
      return fallbackSongs;
  }
};