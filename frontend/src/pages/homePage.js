import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ setUserEmail }) => {
  const [userMessage, setUserMessage] = useState("Welcome to Cre8Path!");
  const [showEmailSignup, setShowEmailSignup] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");




  useEffect(() => {
    fetch("http://localhost:8080/api/v1/demo/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        const display = data.name ? data.name : data.email;
        setUserMessage(`Welcome, ${display}!`);
        setUserEmail(display); 
        localStorage.setItem("userIdentifier", display);
      })
      .catch(() => {
        setUserMessage("Please sign in to access full features.");
      });
  }, []);
  
  

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSignUpMode && password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const endpoint = isSignUpMode
    ? "http://localhost:8080/api/v1/demo/signup"
    : "http://localhost:8080/api/v1/demo/signin";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Ensure cookies are sent
      body: JSON.stringify({ email, password }),
    });

    const msg = await res.text();
    alert(msg);

    if (res.ok) {
      setShowEmailSignup(false);
      setUserEmail(email);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Fetch user details to update UI
      const userRes = await fetch("http://localhost:8080/api/v1/demo/me", {
        method: "GET",
        credentials: "include",
      });
      if (userRes.ok) {
        const data = await userRes.json();
        const display = data.name ? data.name : data.email;
        setUserMessage(`Welcome, ${display}!`);
        setUserEmail(display);
        localStorage.setItem("userIdentifier", display);
      }
    }
  } catch (error) {
    alert("An error occurred. Please try again.");
  }
};
  

  return (
    <>
      <div
  className="w-full flex flex-row justify-between items-start bg-white px-10 pt-12"
  style={{
    backgroundImage: "url('/images/cre8path_bg.png')",
    height: '500px',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
        {/* Left: User Message */}
        <div className="w-1/2">
          <h1 className="text-3xl font-semibold"></h1>
        </div>
  
        {/* Right: Login Section */}
        <div className="w-1/2 flex flex-col items-end pr-6">
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Get 7 free days of Cre8Path
            </h2>
            <div className="mt-1 h-1 w-24 bg-green-500 mx-auto rounded" />
          </div>
  
          <div className="space-y-4 w-full max-w-sm">
            {/* Social logins */}
            <a
  href="http://localhost:8080/oauth2/authorization/google?prompt=select_account"
  className="flex items-center justify-center w-full py-2 border rounded text-gray-800 hover:bg-gray-100"
>
  <img
    src="https://www.svgrepo.com/show/475656/google-color.svg"
    alt="Google"
    className="h-5 w-5 mr-2"
  />
  Continue with Google
</a>

  
            <a
              href="http://localhost:8080/oauth2/authorization/facebook"
              className="flex items-center justify-center w-full py-2 border rounded text-gray-800 hover:bg-gray-100"
            >
              <img
  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
  alt="Facebook"
  className="h-5 w-5 mr-2"
/>

              
              Continue with Facebook
            </a>
  
            <a
              href="http://localhost:8080/oauth2/authorization/github"
              className="flex items-center justify-center w-full py-2 border rounded text-gray-800 hover:bg-gray-100"
            >
             <img
  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
  alt="GitHub"
  className="h-5 w-5 mr-2"
/>

              Continue with GitHub
            </a>
  
            {/* Email signup toggle button */}
            <button
              onClick={() => setShowEmailSignup(true)}
              className="block text-center text-violet-600 font-medium hover:underline w-full"
            >
              Continue with email
            </button>
          </div>
  
          <p className="mt-8 text-xs text-center text-black-500 max-w-sm">
            By signing up you agree to Cre8Path's{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>. This site is
            protected by reCAPTCHA and is subject to Google's{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
        </div>
      </div>
  
      {/* Email Signup Modal */}
      {showEmailSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">

          <button
  onClick={() => setShowEmailSignup(false)}
  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold focus:outline-none"
>
  ×
</button>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">
  {isSignUpMode ? 'Sign up with Email' : 'Sign in with Email'}
</h3>

  
<form className="space-y-4" onSubmit={handleSubmit}>

  <div>
    <label className="block text-sm text-gray-600 mb-1">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-400"
      placeholder="Enter your email"
    />
  </div>

  <div>
    <label className="block text-sm text-gray-600 mb-1">Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-400"
      placeholder="Enter your password"
    />
  </div>

  {/* Only show confirm password in Sign Up mode */}
  {isSignUpMode && (
    <div>
      <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
      <input
        type="password"
        value={confirmPassword} 
        onChange={(e) => setConfirmPassword(e.target.value)} 
        className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-400"
        placeholder="Re-enter your password"
      />
    </div>
  )}

  <button
    type="submit"
    className="w-full bg-violet-600 text-white py-2 rounded hover:bg-violet-700 transition"
  >
    {isSignUpMode ? 'Sign Up' : 'Sign In'}
  </button>
</form>

            <button
  onClick={() => setIsSignUpMode(!isSignUpMode)}
  className="mt-4 text-xs text-gray-500 underline block text-center w-full"
>
  {isSignUpMode
    ? 'Already have an account? Sign in'
    : "Don't have an account? Sign up"}
</button>

          </div>
        </div>
      )}
    </>
  );
}  

export default Home;