import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dashboard from "../component/Dashboard";
import Messages from "../component/Messages";
import Subscribers from "../component/Subscribers";
import Newsletter from "../component/Newsletter";

const AdminHome = () => {
  axios.defaults.withCredentials = true;
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();
  const [displayContent, setDisplayContent] = useState("dashboard"); // Default to dashboard

  useEffect(() => {
    axios
      .get("http://localhost:3001/AdminHome")
      .then((respond) => {
        if (respond.data.success) {
          setAdminName(respond.data.admin);
        } else {
          navigate("/admin"); // Redirect to the login page if the user is not logged in
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [navigate]);

  return (
    <div className="adminhome">
      <div className="adminhomebody">
        <div className="adminNav">
          <h2>Welcome, {adminName.admin}!</h2>
          <div className="navlist">
            <button onClick={() => setDisplayContent("dashboard")}>
              Dashboard
            </button>

            <button onClick={() => setDisplayContent("messages")}>
              Messages
            </button>

            <button onClick={() => setDisplayContent("subscribers")}>
              Subscribers
            </button>

            <button onClick={() => setDisplayContent("newsletter")}>
              Newsletter
            </button>
          </div>
        </div>
        <div className="content">
          {displayContent === "dashboard" && <Dashboard />}
          {displayContent === "messages" && <Messages />}
          {displayContent === "subscribers" && <Subscribers />}
          {displayContent === "newsletter" && <Newsletter />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
