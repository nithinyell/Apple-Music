# Apple Music Charts

![Apple Music Charts](https://img.shields.io/badge/Apple-Music%20Charts-fa586a)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-4-646cff)

A sleek, modern web application that displays Apple Music charts from around the world. Browse top songs, albums, music videos, and playlists with a beautiful, responsive interface.

![App Screenshot](https://i.imgur.com/placeholder.png)

## Features

- **Multiple Chart Types**: Browse top songs, albums, music videos, and playlists
- **Global Charts**: View music charts from 12 different countries
- **Interactive UI**: Modern sidebar navigation with sleek card-based design
- **Detailed Information**: View comprehensive details about each music item
- **Audio Previews**: Listen to song previews directly in the app
- **Responsive Design**: Works beautifully on both desktop and mobile devices

## Technology Stack

- **React**: Frontend UI library
- **Vite**: Build tool and development server
- **CSS3**: Custom styling with modern CSS features
- **Apple Music API**: Data source for music charts

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nithinyell/Apple-Music.git
   cd Apple-Music
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

- Select a chart type (Songs, Albums, Music Videos, Playlists) from the sidebar
- Choose a country from the dropdown menu
- Click on any card to see more details
- Click the play button on a card to open it in Apple Music
- Use the "Refresh Charts" button to update the data

## Project Structure

```
/src
  /assets        # Images and static assets
  /components    # React components
  /networking    # API and data fetching utilities
  /styles        # CSS files
  App.jsx        # Main application component
  main.jsx       # Application entry point
```

## API Information

This application uses the Apple Music RSS Feed API to fetch chart data:
```
https://rss.applemarketingtools.com/api/v2/{country}/music/most-played/{limit}/{feedType}.json
```

The API is accessed through a CORS proxy to enable browser access.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Apple Music for providing the RSS feeds
- All Origins for the CORS proxy service
- React and Vite communities for the excellent tools

---

Created by [Nithin Yell](https://github.com/nithinyell)