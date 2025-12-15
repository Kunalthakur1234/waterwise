import React, { useState, useEffect } from "react";

import SplashScreen from "./components/SplashScreen";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SignupOtp from "./components/SignupOtp";
import ReportProblemButton from "./components/ReportProblemButton";
import ReportProblemForm from "./components/ReportProblemForm";
import MainPage from "./components/MainPage";

import logo from "./assets/waterwise-logo.png";
import backgroundShape from "./assets/background-shape.png";
import "./App.css";

function App() {
  // Splash fade effect
  const [fadeSplash, setFadeSplash] = useState(true);

  // Auth navigation state
  // 'splash', 'login', 'signup', 'otp', 'main'
  const [authPage, setAuthPage] = useState("splash");
  const [signupEmailOrPhone, setSignupEmailOrPhone] = useState("");

  // Main UI state (kept for future use)
  const [isFormVisible, setFormVisible] = useState(false);

  // Splash fade and navigation on mount
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFadeSplash(false), 1500);
    const hideTimer = setTimeout(() => setAuthPage("login"), 2500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // ======================
  // Handlers
  // ======================

  const handleLogin = (emailOrPhone, password) => {
    setAuthPage("main");
  };

  const handleLogout = () => {
    // Optional: clear token here later
    // localStorage.removeItem("token");
    setAuthPage("login");
  };

  const handleShowSignup = () => setAuthPage("signup");

  const handleSignup = (emailOrPhone) => {
    setSignupEmailOrPhone(emailOrPhone);
    setAuthPage("otp");
  };

  const handleSubmitOtp = (otp) => {
    setAuthPage("main");
  };

  const handleReportClick = () => setFormVisible(true);
  const handleCloseForm = () => setFormVisible(false);

  // ======================
  // Render Flow
  // ======================

  if (authPage === "splash") {
    return (
      <div className={`splash-container ${fadeSplash ? "fade-in" : "fade-out"}`}>
        <SplashScreen />
      </div>
    );
  }

  if (authPage === "login") {
    return (
      <Login
        onLogIn={handleLogin}
        onShowSignUp={handleShowSignup}
      />
    );
  }

  if (authPage === "signup") {
    return (
      <Signup
        onSignUp={handleSignup}
        onGoToLogin={() => setAuthPage("login")}
      />
    );
  }

  if (authPage === "otp") {
    return (
      <SignupOtp
        emailOrPhone={signupEmailOrPhone}
        onSubmitOtp={handleSubmitOtp}
      />
    );
  }

  // ======================
  // MAIN PAGE AFTER LOGIN
  // ======================

  if (authPage === "main") {
    return <MainPage onLogout={handleLogout} />;
  }

  return null;
}

export default App;
