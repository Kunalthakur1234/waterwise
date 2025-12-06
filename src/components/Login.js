// src/components/Login.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css"; // Import your updated CSS file

function Login({ onLogIn, onShowSignUp }) {
  const [emailOrPhoneLogin, setEmailOrPhoneLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    // TODO: send credentialResponse.credential to backend for Google auth
  };

  const handleGoogleLoginError = () => {
    alert("Google login failed.");
  };

  const handleLogin = async () => {
    if (!emailOrPhoneLogin || !password) {
      alert("Enter email/phone and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhoneLogin,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      alert("Login successful!");

      // Optional: store token for authenticated requests later
      // localStorage.setItem("token", data.token);

      // Call parent handler so App.js can change page to "main"
      onLogIn(emailOrPhoneLogin, password);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">Log In</h2>

        <input
          className="login-input"
          type="text"
          placeholder="email or phone no."
          value={emailOrPhoneLogin}
          onChange={(e) => setEmailOrPhoneLogin(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p>
          Don't have an account?{" "}
          <button className="link-btn" onClick={onShowSignUp}>
            Sign Up
          </button>
        </p>

        <div className="social-login-container">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
