import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18 üçin täze usul
import './index.css'; // Stil faýlyny çagyrmak
import App from './App'; // Biziň esasy komponentimizi (App.js) çagyrmak

// React programmasynyň başlaýan nokady
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
