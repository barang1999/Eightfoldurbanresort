import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

// Fix 100vh issue on mobile browsers
const setAppHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--app-height', `${vh * 100}px`);
};
setAppHeight();
window.addEventListener('resize', setAppHeight);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
