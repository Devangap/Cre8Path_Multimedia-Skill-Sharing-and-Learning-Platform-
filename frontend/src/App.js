import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/homePage';
import PostUpload from './components/PostUpload';

function App() {
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('userIdentifier');
    if (savedIdentifier) setUserIdentifier(savedIdentifier);
  }, []);

  const handleSetUserIdentifier = (identifier) => {
    setUserIdentifier(identifier);
    localStorage.setItem('userIdentifier', identifier);
  };

  return (
    <Router>
      <Navbar userEmail={userIdentifier} />
      <Routes>
        <Route path="/" element={<Home setUserEmail={handleSetUserIdentifier} />} />
        <Route path="/upload" element={<PostUpload userEmail={userIdentifier} />} />
      </Routes>
    </Router>
  );
}

export default App;