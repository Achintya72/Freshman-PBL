import './App.css';
import { Route, Routes as Switch, Navigate } from "react-router-dom";
import Home from './Home';
import Authentication from './SignIn';
import Dashboard from './Dashboard';
import Navbar from "./Navbar.jsx"
import { useContext } from 'react';
import UserContext from "./userContext";
import { initializeApp } from "firebase/app"
const firebaseConfig = {
  apiKey: "AIzaSyAYMl9uADI6Zk8a4NLvGfe4zG29Sd7FOBE",
  authDomain: "stempbl2022.firebaseapp.com",
  projectId: "stempbl2022",
  storageBucket: "stempbl2022.appspot.com",
  messagingSenderId: "251937321295",
  appId: "1:251937321295:web:a0b0f464089fbab893d53a",
  measurementId: "G-LPSW8QH5TM"
};
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  else {
    return children;
  }
}

function App() {
  const app = initializeApp(firebaseConfig);
  const { user } = useContext(UserContext);
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<Authentication />} />
        <Route path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Switch>
    </>
  );
}

export default App;
