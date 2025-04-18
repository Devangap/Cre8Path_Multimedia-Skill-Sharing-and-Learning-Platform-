import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/homePage';
import Questionnaire from './pages/Questionnaire'; 

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem("userIdentifier") || "");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleSetUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  return (
    <Router>
      <Navbar userEmail={userIdentifier} />
      <Routes>
        <Route path="/" element={<Home setUserEmail={setUserIdentifier} />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </Router>
  );
}

export default App;
