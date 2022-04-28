import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeContextProvider } from './Theme';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './userContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserContextProvider>
      <ThemeContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ThemeContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);

