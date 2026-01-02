import { useState } from "react";
import "./ChangePassword.css";
import api from "../../Config/api.js";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [mail, setMail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newConfirmPass, setNewConfirmPass] = useState("");
  const navigate = useNavigate();

  const handleNewPassword = async () => {
    if (newPass !== newConfirmPass) {
      toast.error("confirm password must match new Password");
      return;
    }
    try {
      await api.put("/update-password", {
        email: mail,
        password: newPass,
      });
      toast.success("password updated");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="page">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container">
        <div className="logo">
          <span>QuickStay</span>
        </div>

        <div className="card">
          <h2>Change Password</h2>

          <form className="form">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                onChange={(e) => setMail(e.target.value)}
              />
            </div>

            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                onChange={(e) => setNewConfirmPass(e.target.value)}
              />
            </div>

            <div className="checkbox">
              <input type="checkbox" />
              <span>
                I accept the <a href="#">Terms and Conditions</a>
              </span>
            </div>

            <button type="button" onClick={handleNewPassword}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ChangePassword;
