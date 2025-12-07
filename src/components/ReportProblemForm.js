// src/components/ReportProblemForm.js
import React, { useState } from "react";
import "./ReportProblemForm.css";

function ReportProblemForm({ onClose }) {
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problemType || !description || !location) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      // IMPORTANT: Use FormData for file upload
      const formData = new FormData();
      formData.append("problemType", problemType);
      formData.append("description", description);
      formData.append("location", location);
      if (photo) {
        formData.append("photo", photo); // name "photo" must match upload.single("photo")
      }

      const res = await fetch("http://localhost:5000/api/report-problem", {
        method: "POST",
        body: formData, // DO NOT set Content-Type manually
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit problem");
        return;
      }

      alert("Problem submitted successfully!");

      setProblemType("");
      setDescription("");
      setPhoto(null);
      setLocation("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Report a Water Problem</h2>

        <label>Problem Type:</label>
        <select
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          required
        >
          <option value="">Select a problem</option>
          <option value="contamination">Water Contamination</option>
          <option value="flooding">Drainage Flooding</option>
          <option value="pond_condition">Unsightly Pond/Lake</option>
          <option value="pipe_leakage">Pipe Leakage</option>
        </select>

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue"
          required
        />

        <label>Upload Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReportProblemForm;
