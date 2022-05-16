import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ThemeContextProvider } from './Theme';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './userContext';
import { initializeApp } from "firebase/app"

const root = ReactDOM.createRoot(document.getElementById('root'));

const firebaseConfig = {
  apiKey: "AIzaSyAYMl9uADI6Zk8a4NLvGfe4zG29Sd7FOBE",
  authDomain: "stempbl2022.firebaseapp.com",
  projectId: "stempbl2022",
  storageBucket: "stempbl2022.appspot.com",
  messagingSenderId: "251937321295",
  appId: "1:251937321295:web:a0b0f464089fbab893d53a",
  measurementId: "G-LPSW8QH5TM"
};
const app = initializeApp(firebaseConfig)
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

