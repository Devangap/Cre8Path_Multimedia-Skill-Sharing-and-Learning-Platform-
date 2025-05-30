// import React, { useEffect, useState } from 'react';

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/homePage';
// import Questionnaire from './pages/Questionnaire'; 

// import PostUpload from './components/PostUpload';
// import PostLogin from './pages/PostLogin';


// import MyPosts from './pages/MyPosts';
// import EditPost from './pages/EditPost';
// import PostDetails from './pages/PostDetails';
// import Feed from './pages/Feed';

// import ProfileForm from './pages/Profile/ProfileForm';
// import ProfilePage from './pages/Profile/ProfilePage';



// import LearningpList from './pages/Learningp/LearningpList';
// import LearningpCreate from './pages/Learningp/LearningpCreate';
// import LearningpEdit from './pages/Learningp/LearningpEdit';


// // LearningPlan
// import LearningPlanCreate from "./pages/LearningPlans/LearningPlanCreate";
// import MyLearningPlans from './pages/LearningPlans/MyLearningPlans';


// function App() {
//   const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');
//   const [userEmail, setUserEmail] = useState("");
//   //comment
 

//   useEffect(() => {
//     const savedIdentifier = localStorage.getItem('userIdentifier');
//     if (savedIdentifier) setUserIdentifier(savedIdentifier);
//   }, []);


//   const handleSetUserEmail = (email) => {
//     setUserEmail(email);
//     localStorage.setItem("userEmail", email);

// //   const handleSetUserIdentifier = (identifier) => {
// //     setUserIdentifier(identifier);
// //     localStorage.setItem('userIdentifier', identifier);

//   };

//   return (
//     <Router>
//       <Navbar userEmail={userIdentifier} />
//       <Routes>
//   <Route path="/" element={<Home setUserEmail={setUserIdentifier} />} />
//   <Route path="/questionnaire" element={<Questionnaire />} />
//   <Route path="/upload" element={<PostUpload userEmail={userIdentifier} />} />
//   <Route path="/feed" element={<Feed />} />

//   <Route path="/post-login" element={<PostLogin setUserEmail={setUserIdentifier} />} /> {/* ✅ THIS */}

//   <Route path="/my-posts" element={<MyPosts userEmail={userIdentifier} />} />
//   <Route path="/posts/:id/edit" element={<EditPost userEmail={userEmail} />} />
//   <Route path="/posts/:id/" element={<PostDetails />} />

//   <Route path="/post-login" element={<PostLogin setUserEmail={setUserIdentifier} />} /> 
//   <Route path="/profile-form" element={<ProfileForm setUserEmail={setUserEmail} />} />
//   <Route path="/profile/:username" element={<ProfilePage />} />



//   <Route path="/learningp" element={<LearningpList />} />
//   <Route path="/learningp/create" element={<LearningpCreate />} />
//   <Route path="/learningp/edit/:id" element={<LearningpEdit />} />

//   {/* LearningPlans CREATE */}
//   {/* <Route path="/learning-plans/create" element={<LearningPlanCreate />} /> */}
//   <Route path="/profile/:username" element={<ProfilePage />} />
//   <Route path="/learning-plans/create" element={<ProfilePage />} />
//   <Route path="/my-learning-plans" element={<MyLearningPlans />} />


// </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/homePage';
import Questionnaire from './pages/Questionnaire';
import PostUpload from './components/PostUpload';
import PostLogin from './pages/PostLogin';
import MyPosts from './pages/MyPosts';
import EditPost from './pages/EditPost';
import PostDetails from './pages/PostDetails';
import Feed from './pages/Feed';
import ProfileForm from './pages/Profile/ProfileForm';
import ProfilePage from './pages/Profile/ProfilePage';
import LearningpList from './pages/Learningp/LearningpList';
import LearningpCreate from './pages/Learningp/LearningpCreate';
import LearningpEdit from './pages/Learningp/LearningpEdit';
import NotificationsList from './pages/Notifications/Notification.js';

// LearningPlan
import LearningPlanCreate from "./pages/LearningPlans/LearningPlanCreate";

import MyLearningPlans from './pages/LearningPlans/MyLearningPlans';

const AppContent = () => {
  const location = useLocation();
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem('userIdentifier') || '');
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('userIdentifier');
    if (savedIdentifier) setUserIdentifier(savedIdentifier);
  }, []);

  const handleSetUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  // Hide navbar on homepage
  // Hide navbar on homepage and questionnaire
  const hideNavbarOnPaths = ['/', '/questionnaire'];
  const shouldShowNavbar = !(
    hideNavbarOnPaths.includes(location.pathname) ||
    /^\/posts\/[^/]+$/.test(location.pathname) // hides on /posts/:id
  );
  


  return (
    <>
      {shouldShowNavbar && <Navbar userEmail={userIdentifier} />}
      <Routes>

        <Route path="/" element={<Home setUserEmail={setUserIdentifier} />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/upload" element={<PostUpload userEmail={userIdentifier} />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post-login" element={<PostLogin setUserEmail={setUserIdentifier} />} />
        <Route path="/my-posts" element={<MyPosts userEmail={userIdentifier} />} />
        <Route path="/posts/:id/edit" element={<EditPost userEmail={userEmail} />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/profile-form" element={<ProfileForm setUserEmail={handleSetUserEmail} />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/learningp" element={<LearningpList />} />
        <Route path="/learningp/create" element={<LearningpCreate />} />
        <Route path="/learningp/edit/:id" element={<LearningpEdit />} />
        <Route path="/my-learning-plans" element={<MyLearningPlans />} />
        <Route path="/notifications" element={<NotificationsList />} />
      </Routes>
    </>
  );
};


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
