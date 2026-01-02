import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../../assets/bag.gif";
import { UilSignOutAlt, UilBars, UilTimes } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard") setSelected(0);
    else if (location.pathname === "/add_rooms") setSelected(1);
    else setSelected(2);
  }, [location.pathname]);

  return (
    <>
      <div className="mobile-menu-icon" onClick={() => setOpen(!open)}>
        {open ? <UilTimes size="30" /> : <UilBars size="30" />}
      </div>

      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <div className={`Sidebar ${open ? "open" : ""}`}>
        <div className="logo">
          <img src={logo} alt="" />
          <span>
            Quick<span>S</span>tay
          </span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => {
                setSelected(index);
                setOpen(false);
                if (index === 0) navigate("/dashboard");
                else if (index === 1) navigate("/add_rooms");
                else navigate("/list");
              }}>
              <item.icon size="24" color="orange" />
              <span>{item.heading}</span>
            </div>
          ))}

          <div
            className="menuItem"
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}>
            <UilSignOutAlt size="24" color="orange" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
