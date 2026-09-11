import React, { useState } from "react";
import axios from "axios";
import "../style/Admin.css";
import { Mail, Lock, LogIn } from "lucide-react";

const Admin = () => {
  // State for form input values and error message
  const [formData, setFormData] = useState({
    Admin: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/admin/login", formData)
      .then((response) => {
        if (response.data.success) {
          // Redirect to the admin home page.
          window.location.href = "/adminhome";

        } else {
          // Authentication failed, display an error message
          setError("Invalid credentials. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Set an error message
        setError("Failed to authenticate. Please try again later.");
      });
  };

  return (
    <div className="Admin" id="Admin">
      <div className="FormArea">
        <form onSubmit={handleSubmit}>
          <h1 className="heading">Admin</h1>
          <br />
          <div className="Inputs">
            <Mail className="FormIcon w-4 h-4 text-zinc-400" />
            <input
              type="text"
              id="Admin"
              name="Admin"
              className="Admin"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="Admin">Admin</label>
          </div>
          <div className="Inputs">
            <Lock className="FormIcon w-4 h-4 text-zinc-400" />
            <input
              type="password"
              id="password"
              name="password"
              className="password"
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="SubmitBtn inline-flex items-center justify-center gap-2" type="submit">
            <LogIn className="w-4 h-4" /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
