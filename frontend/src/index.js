import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Start MSW in both development and production for demo purposes
async function startMSW() {
  // For demo purposes, we'll run MSW in both environments
  const { worker } = await import('./mocks/browser');
  worker.start({
    onUnhandledRequest: 'bypass', // Requests without handlers will pass through
  });
}

// Initialize MSW
startMSW().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 