import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/homePage';
import Questionnaire from './pages/Questionnaire'; 

import PostUpload from './components/PostUpload';
import PostLogin from './pages/PostLogin';

import LearningpList from './pages/Learningp/LearningpList';
import LearningpCreate from './pages/Learningp/LearningpCreate';
import LearningpEdit from './pages/Learningp/LearningpEdit';

function App() {
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');
  const [userEmail, setUserEmail] = useState("");
 

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
  <Route path="/post-login" element={<PostLogin setUserEmail={setUserIdentifier} />} /> {/* ✅ THIS */}
  <Route path="/learningp" element={<LearningpList />} />
  <Route path="/learningp/create" element={<LearningpCreate />} />
  <Route path="/learningp/edit/:id" element={<LearningpEdit />} />
</Routes>
    </Router>
  );
}

export default App;