
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Optimize initial render
const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

// Use concurrent features for better performance
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preload critical resources
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Preload images that are likely to be used
    const img = new Image();
    img.src = '/lovable-uploads/3c8a256a-babc-45a4-bf11-fb10887a065e.png';
  });
}
