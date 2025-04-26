import React from 'react';

const Sidebar = ({ userEmail }) => {
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
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 space-y-4">
        {userEmail && (
          <div className="text-sm text-gray-600 break-words">
            Signed in as: <br /> {userEmail}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Sidebar;
