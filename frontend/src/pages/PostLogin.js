import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostLogin = ({ setUserEmail }) => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/demo/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("User not authenticated");
        return res.json();
      })
      .then((data) => {
        console.log("Post-login fetched user:", data); // 🛠️ Debugging
        const display = data.name || data.email;
        localStorage.setItem("userIdentifier", display);
        setUserEmail(display);

        if (data.firstTimeLogin === true || data.firstTimeLogin === "true") {
          localStorage.setItem("questionnaireCompleted", "false");
          navigate("/questionnaire"); // ✅ Go to questionnaire if first time
        } else {
          localStorage.setItem("questionnaireCompleted", "true");
          navigate("/"); // ✅ Else go to home
        }
      })
      .catch((err) => {
        console.error("OAuth post-login error:", err);
        navigate("/"); // Optionally redirect even if failed
      });
  }, []);

  return <div>Logging you in...</div>;
};

export default PostLogin;
