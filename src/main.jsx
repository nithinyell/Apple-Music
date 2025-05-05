import React from 'react';
import ReactDOM from 'react-dom/client';
import './FixSafeArea'; // Import before CSS to ensure variables are set
import './index.css';
import './styles/FixPadding.css'; // Import after other CSS to override styles
import './styles/PWAFixes.css'; // Additional PWA-specific fixes
import './styles/PortraitMode.css'; // Portrait mode specific fixes
import './styles/CenteredHeader.css'; // Centered header styles
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();