import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userEmail }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center font-bold text-xl" style={{ color: '#A367B1' }}>
            Cre8Path
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            {userEmail ? (
              <>
                <Link to="/upload" className="text-gray-700 hover:text-blue-600">Upload</Link>
                <span className="text-sm text-gray-600">Signed in as: {userEmail}</span>
                <button
                  onClick={() => {
                    fetch('http://localhost:8080/logout', {
                      method: 'POST',
                      credentials: 'include',
                    }).then(() => {
                      localStorage.removeItem('userIdentifier');
                      window.location.href = '/';
                    });
                  }}
                  className="text-red-500 hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="http://localhost:8080/oauth2/authorization/google?prompt=select_account"
                className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;