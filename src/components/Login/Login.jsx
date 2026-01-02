import React, { useEffect } from "react";
import "./Login.css";
import { useState } from "react";
import api from "../../Config/api.js";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/loginAdmin", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login Successfull");
      setFormData({
        email: "",
        password: "",
      });
      setIsAuthenticated(true);
      console.log(res.data);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      toast.error("Invalid Email or Password");
      console.log(error);
    }
  };

  useEffect(() => {
    sessionStorage.clear();

    window.history.pushState(null, "", window.location.href);

    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", blockBack);

    return () => window.removeEventListener("popstate", blockBack);
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="login-wrapper">
        <div className="signin-container">
          <h2 className="signin-title">Sign In</h2>
          <p className="signin-subtitle">Login to your account</p>

          <form
            className="signin-form"
            onSubmit={handleSubmit}
            autoComplete="off">
            <label htmlFor="email" className="signin-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="signin-input"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="password" className="signin-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="signin-input"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="signin-forgot">
              <a
                onClick={() => navigate("/forgot-password")}
                className="forgot-link"
                style={{ cursor: "progress" }}>
                Forgot password?
              </a>
            </div>
            <button
              type="button"
              className="signin-btn"
              onClick={() => navigate("/signup")}>
              Signup
            </button>

            <button type="submit" className="signin-btn">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
