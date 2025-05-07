import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✨ Import Framer Motion

const Home = ({ setUserEmail }) => {
  const navigate = useNavigate();
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

        if (data.firstTimeLogin === true || data.firstTimeLogin === "true") {
          localStorage.setItem("questionnaireCompleted", "false");
          navigate("/questionnaire");
        } else {
          localStorage.setItem("questionnaireCompleted", "true");
          navigate("/feed"); 
        }
        
      })
      .catch(() => {
        setUserMessage("Please sign in to access full features.");
      });
  }, [setUserEmail, navigate]);

  

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
        credentials: "include",
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

          if (data.firstTimeLogin === true || data.firstTimeLogin === "true") {
            localStorage.setItem("questionnaireCompleted", "false");
            navigate("/questionnaire");
          } else {
            localStorage.setItem("questionnaireCompleted", "true");
            navigate("/");
          }
        }
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      

      {/* Main Section - After Hero */}
      <div className="flex flex-col md:flex-row justify-center items-start  px-6 md:px-20 min-h-[55vh] bg-gray-50 "
      style={{
        background: 'linear-gradient(to right, #A367B1, #C5DFF8, #AEE2FF, #5D3587)',
      }}>
        
        {/* Left side - Learn. Share. Grow. */}
         <div className="flex flex-col items-start w-full md:w-1/2 mb-10 mt-20 md:mb-0 pl-10 md:pl-24 space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, duration: 0.6 }}
              className="text-7xl font-extrabold text-white  ml-0"
            >
              Learn.
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-7xl font-extrabold text-white ml-40"
            >
              Share.
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-7xl font-extrabold text-white ml-80"
            >
              Grow.
            </motion.h2>
          </div>




        {/* Right side - Login Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mt-20 ml-20">
  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
    Sign In or Get Started
  </h2>

  <div className="space-y-4">
    {/* Social Logins */}
    <a
      href="http://localhost:8080/oauth2/authorization/google?prompt=select_account"
      className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="h-5 w-5 mr-2"
      />
      Continue with Google
    </a>

    {/* <a
      href="http://localhost:8080/oauth2/authorization/facebook"
      className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
      className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
        alt="GitHub"
        className="h-5 w-5 mr-2"
      />
      Continue with GitHub
    </a> */}

    {/* Email signup toggle */}
    <button
      onClick={() => setShowEmailSignup(true)}
      className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
    >
      <span className="text-violet-800 font-semibold">Continue with Email</span>
    </button>
  </div>

  <p className="mt-6 text-xs text-gray-500 text-center">
    By signing up, you agree to our{" "}
    <span className="underline">Terms of Service</span> and{" "}
    <span className="underline">Privacy Policy</span>.
  </p>
</div>
</div>
<div className="w-full flex flex-col items-center justify-center text-center px-4 py-32 bg-gray-50">
  <div className="border-2 border-violet-300 rounded-3xl px-20 py-16 shadow-lg max-w-5xl w-full">
    <h1 className="text-5xl font-bold text-gray-700 mb-6">
      Unlock Your Creativity with Cre8Path
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      Learn new skills, share your passion, and grow your talent with the community.
    </p>
  </div>
</div>





<div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 bg-gray-50 px-6 md:px-20 py-20 ">
  {/* Text Content */}
  <div className="flex flex-col items-start md:w-1/2 mb-10 md:mb-0">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
      Empower Your Creativity Through Skill Sharing
    </h2>
    <p className="text-lg text-gray-600 mb-6">
      85% of creators say collaborating with others helped them unlock new career opportunities and grow faster.
    </p>
    <p className="text-lg text-gray-600 mb-8">
      On Cre8Path, multimedia enthusiasts learn from each other, collaborate globally, and transform passions into thriving careers.
    </p>
    <button className="px-6 py-3 bg-violet-800 text-white rounded hover:bg-violet-700 transition">
      Discover Skill Communities →
    </button>
  </div>

  {/* Image */}
  <div className="md:w-1/2 flex justify-center">
  <img
    src="/images/collab.png"
    alt="Creative Collaboration"
    className="rounded-2xl shadow-xl w-[28rem] max-w-full h-auto object-cover"
  />
</div>

</div>





      {/* Email Signup Modal */}
      {showEmailSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
            <button
              onClick={() => setShowEmailSignup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold focus:outline-none"
            >
              ×
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {isSignUpMode ? 'Sign Up with Email' : 'Sign In with Email'}
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

              {isSignUpMode && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded outline-none focus:ring-2 focus:ring-violet-400"
                    placeholder="Confirm your password"
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
      {/* Footer */}
{/* <footer className="bg-gray-800 text-white text-center py-6 mt-auto">
  <div className="container mx-auto px-4">
    <p className="text-sm">&copy; {new Date().getFullYear()} Cre8Path. All rights reserved.</p>
    <div className="mt-2 flex justify-center gap-4 text-gray-400 text-sm">
      <a href="#" className="hover:text-white">Privacy Policy</a>
      <a href="#" className="hover:text-white">Terms of Service</a>
      <a href="#" className="hover:text-white">Contact</a>
    </div>
  </div>
</footer> */}

    </>
  );
};

export default Home;
