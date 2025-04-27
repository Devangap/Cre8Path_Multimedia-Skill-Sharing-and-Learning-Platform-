import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ userEmail }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/profile/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user profile.");
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]); 
  
  
  
  console.log(userData)

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between fixed">
      <div className="p-6">
        {/* Logo */}
        <div className="text-2xl font-bold mb-8" style={{ color: '#A367B1' }}>
          Cre8Path
        </div>

        {/* Links */}
        <nav className="flex flex-col space-y-4">
  <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
  <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
  <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>

  {userEmail && (
    <>
      <a href="/upload" className="text-gray-700 hover:text-blue-600">Upload</a>
    
    </>
  )}
  {userData && (
  <a href={`/profile/${userData.username}`} className="text-gray-700 hover:text-blue-600">
    Profile
  </a>
)}
{userEmail && !userData && (
  <button
    onClick={() => navigate("/profile-form")}
    className="text-gray-700 hover:text-green-600 text-left"
  >
    Create Profile
  </button>
)}


</nav>

      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4">
        {userEmail && (
          <div className="text-sm text-gray-600 break-words">
            Signed in as: <br /> {userEmail}
          </div>
        )}

        {userEmail && (
          <button
            onClick={() => {
              fetch("http://localhost:8080/logout", {
                method: "POST",
                credentials: "include",
              }).then(() => {
                localStorage.removeItem("userIdentifier");
                window.location.href = "/";
              });
            }}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        )}
        {!userEmail && (
          <a
            href="http://localhost:8080/oauth2/authorization/google?prompt=select_account"
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 text-center block"
          >
            Sign In
          </a>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
