import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import EditProfileModal from '../pages/Profile/EditProfileModal'; 

const Sidebar = ({ userEmail }) => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ 1. Call backend logout to clear Spring Security session
      await fetch("http://localhost:8080/api/v1/demo/logout", {
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  
    // ✅ 2. Clear frontend storage/state
    localStorage.removeItem("userIdentifier");
    sessionStorage.removeItem("userIdentifier");
    setUserData(null);
  
    // ✅ 3. Optional: If using Google OAuth, redirect to Google logout
    const isOAuthUser = userEmail && userEmail.endsWith("@gmail.com"); // crude check, customize if needed
    window.location.href = "/";

  };
  
  
  

  // Handle Profile Deletion
  // const handleDeleteProfile = async () => {
  //   const confirmed = window.confirm("Are you sure you want to permanently delete your profile?");
  //   if (!confirmed) return;
  
  //   try {
  //     const res = await fetch('http://localhost:8080/api/profile/delete', {
  //       method: 'DELETE',
  //       headers: { "Content-Type": "application/json" }, 
  //       credentials: 'include',  
  //     });
  
  //     const data = await res.json();
  
  //     if (res.ok) {
  //       alert(data.message || "Profile deleted successfully!");
      
  //       // 🔐 Trigger backend logout
  //       await fetch("http://localhost:8080/api/v1/demo/logout", {
  //         credentials: "include",
  //       });
      
  //       // 🧹 Clear frontend state
  //       localStorage.removeItem("userIdentifier");
  //       sessionStorage.removeItem("userIdentifier");
  //       setUserData(null);
      
  //       // 🔄 Redirect to login/home
  //       window.location.href = "/";
  //     }
      
  //     else {
  //       alert(data.error || "Something went wrong");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert('❌ Failed to delete your profile.');
  //   }
  // };

  // Fetch user data
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

  // Handle Search
  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/profile/search?query=${searchQuery}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to search profiles.");
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching profiles:", err.message);
    }
  };

  // Fetch user data when the user email is present
  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  // Search profiles when the query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearch();
    } else {
      setSearchResults([]); // Clear search results if query is too short
    }
  }, [searchQuery]);

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between fixed">
      <div className="p-6">
        {/* Logo */}
        <div className="text-2xl font-bold mb-8" style={{ color: '#A367B1' }}>
          Cre8Path
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search profiles..."
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="bg-white p-4 shadow-md rounded mt-2 max-h-64 overflow-y-auto">
            <ul>
              {searchResults.map((profile) => (
                <li key={profile.id} className="mb-2">
                  <a
                    href={`/profile/${profile.username}`}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {profile.username}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Links */}
        <nav className="flex flex-col space-y-4">
        {userEmail ? (
    <a href="/feed" className="text-gray-700 hover:text-blue-600">Home</a>
  ) : (
    <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
  )}
          {/* <a href="/about" className="text-gray-700 hover:text-blue-600">About</a> */}
          {/* <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a> */}

          {/* {userEmail && (
            <>
              <a href="/upload" className="text-gray-700 hover:text-blue-600">Upload</a>
            </>
          )} */}
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

        {/* Logout Button */}
        {userEmail && (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline text-sm"
          >
            Logout
          </button>
        )}

        {/* If no user is logged in, show the sign-in link */}
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
