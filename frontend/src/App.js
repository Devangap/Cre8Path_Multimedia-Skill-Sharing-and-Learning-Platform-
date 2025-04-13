import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/homePage';

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userIdentifier, setUserIdentifier] = useState(localStorage.getItem("userIdentifier") || "");

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleSetUserEmail = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email); // persist email
  };

  return (
    <>
      <Navbar userEmail={userIdentifier} />
      <Home setUserEmail={setUserIdentifier} />
    </>
  );
}

export default App;