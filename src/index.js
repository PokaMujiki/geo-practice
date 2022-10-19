import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/App.css'
import './styles/Map.css';
import App from './components/App';
// import "leaflet/dist/leaflet.css"

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <App />
);
