import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/homePage';
import Questionnaire from './pages/Questionnaire'; 

import PostUpload from './components/PostUpload';
import PostLogin from './pages/PostLogin';

import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';

import ProfileForm from './pages/ProfileForm';



function App() {
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');
  const [userEmail, setUserEmail] = useState("");
  //comment
 

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
  <Route path="/my-posts" element={<MyPosts userEmail={userIdentifier} />} />
  <Route path="/posts/:id/edit" element={<EditPost userEmail={userEmail} />} />
  <Route path="/posts/:id/" element={<PostDetails />} />

  <Route path="/post-login" element={<PostLogin setUserEmail={setUserIdentifier} />} /> 
  <Route path="/profile-form" element={<ProfileForm setUserEmail={setUserEmail} />} />


</Routes>
    </Router>
  );
}

export default App;