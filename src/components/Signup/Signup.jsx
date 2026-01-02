import React, { useState } from "react";
import api from "../../Config/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.warning("Email and Password is required");
      return;
    }
    try {
      const res = await api.post("/addAdmin", formData);
      toast.success("Admin Added Successfully");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-row">
            <div className="signup-left">
              <p className="signup-title">Sign Up</p>

              <div className="signup-input-row">
                <i className="fa-solid fa-envelope icon"></i>
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div className="signup-input-row">
                <i className="fa-solid fa-lock icon"></i>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div className="buttons">
                <button className="signup-btn" onClick={handleSubmit}>
                  Register
                </button>
                <button
                  className="signup-btn"
                  onClick={() => {
                    navigate("/");
                  }}>
                  Login
                </button>
              </div>
            </div>

            <div className="signup-right">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                alt="Signup Visual"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
