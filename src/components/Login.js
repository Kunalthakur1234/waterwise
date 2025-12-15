// src/components/Login.js
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

function Login({ onLogIn, onShowSignUp }) {
  const [emailOrPhoneLogin, setEmailOrPhoneLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* =======================
     GOOGLE LOGIN HANDLER
     ======================= */
  const handleGoogleLoginSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);

    // 👉 Google gives us a JWT token
    const googleToken = credentialResponse.credential;

    // (optional) save token
    localStorage.setItem("googleToken", googleToken);

    // 👉 Redirect to main page
    onLogIn("google-user", "google-auth");
  };

  const handleGoogleLoginError = () => {
    alert("Google login failed. Please try again.");
  };

  /* =======================
     NORMAL LOGIN
     ======================= */
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

        {/* GOOGLE LOGIN */}
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
