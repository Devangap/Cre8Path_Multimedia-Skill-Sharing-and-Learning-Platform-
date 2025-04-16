import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/homePage';
import Questionnaire from './pages/Questionnaire'; 

import PostUpload from './components/PostUpload';


function App() {
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('userIdentifier');
    if (savedIdentifier) setUserIdentifier(savedIdentifier);
  }, []);


  const handleSetUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);

//   const handleSetUserIdentifier = (identifier) => {
//     setUserIdentifier(identifier);
//     localStorage.setItem('userIdentifier', identifier);

  };

  return (
    <Router>
      <Navbar userEmail={userIdentifier} />
      <Routes>

        <Route path="/" element={<Home setUserEmail={setUserIdentifier} />} />
        <Route path="/questionnaire" element={<Questionnaire />} />

        <Route path="/upload" element={<PostUpload userEmail={userIdentifier} />} />

      </Routes>
    </Router>
  );
}

export default App;