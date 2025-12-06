// src/components/Signup.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css"; // Reuse the existing styles

function Signup({ onSignUp, onGoToLogin }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Form submission to backend
  const handleSubmit = async () => {
    if (emailOrPhone.trim() === "" || password.trim() === "") {
      alert("Please enter your email/phone and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailOrPhone, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        setEmailOrPhone("");
        setPassword("");
        onGoToLogin();
      } else {
        alert("Error: " + (data.message || data.error || "Signup failed"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Sign Up</h2>

        <input
          className="login-input"
          type="text"
          placeholder="email or phone no."
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signup-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p>
          Already have an account?{" "}
          <button className="link-btn" onClick={onGoToLogin}>
            Log In
          </button>
        </p>

        <div className="social-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              // TODO: Send credentialResponse.credential to backend for Google signup/login
              console.log("Google signup success:", credentialResponse);
            }}
            onError={() => alert("Google login/signup failed")}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default Signup;
