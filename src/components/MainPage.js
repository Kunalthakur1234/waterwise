import React, { useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiLogOut,
  FiHelpCircle,
} from "react-icons/fi";
import { MdMiscellaneousServices } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaUserTie, FaUserCircle } from "react-icons/fa";

import ReportProblemForm from "./ReportProblemForm";
import "./MainPage.css";

function MainPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  return (
    <div className="page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="left">
          <FiMenu
            size={26}
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          <div className="logo">WaterWise</div>
        </div>

        {!showReportForm ? (
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search location..."
              className="search-input"
            />
            <FiSearch className="search-icon" />
          </div>
        ) : (
          <div className="report-title">REPORT</div>
        )}

        <div className="profile-circle">
          <FaUserCircle size={22} />
        </div>

        {menuOpen && (
          <div className="dropdown">
            <div className="menu-item"><FaUserCircle /> Profile</div>
            <div className="menu-item"><FaUserTie /> Join as Service Provider</div>
            <div className="menu-item"><MdMiscellaneousServices /> Services</div>
            <div className="menu-item"><RiContactsLine /> Contact Us</div>
            <div className="menu-item"><AiOutlineInfoCircle /> About</div>
            <div className="menu-item"><FiLogOut /> Log out</div>
          </div>
        )}
      </div>

      {/* MAP */}
      {!showReportForm && (
        <div className="map-box">
          <iframe
            title="google-map"
            src="https://www.google.com/maps?q=India&output=embed"
            className="map-iframe"
            loading="lazy"
          />
        </div>
      )}

      {/* BOTTOM BAR */}
      {!showReportForm && (
        <div className="bottom-bar">
          <button
            className="report-btn"
            onClick={() => setShowReportForm(true)}
          >
            Report a Water Issue
          </button>

          <div className="help-icon-wrapper">
            <FiHelpCircle className="help-icon" />
          </div>
        </div>
      )}

      {/* REPORT FORM */}
      {showReportForm && (
        <ReportProblemForm onClose={() => setShowReportForm(false)} />
      )}
    </div>
  );
}

export default MainPage;
