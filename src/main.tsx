
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAnalytics } from './lib/analytics'

// Initialize Google Analytics immediately for improved tracking
initializeAnalytics();

// Use requestIdleCallback for non-critical initialization (falls back to setTimeout for older browsers)
const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

idleCallback(() => {
  // Log initialization for debugging
  console.log('BndBox application initializing');
  
  // Render the app after initialization
  createRoot(document.getElementById("root")!).render(<App />);
});
