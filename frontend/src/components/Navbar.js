import React from 'react';

const Navbar = ({ userEmail }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        <div className="flex-shrink-0 flex items-center font-bold text-xl" style={{ color: '#A367B1' }}>
            Cre8Path
        </div>

          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            {/* <a
              href="/oauth2/authorization/google"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign in
            </a>
            <a
              href="/oauth2/authorization/google"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign up
            </a> */}
             {userEmail && (
              <span className="text-sm text-gray-600">Signed in as: {userEmail}</span>
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
  className="text-red-500 hover:underline"
>
  Logout
</button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;