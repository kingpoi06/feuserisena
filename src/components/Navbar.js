import React from 'react';
import {  IoHome} from "react-icons/io5";
import { IoMdMedkit } from 'react-icons/io';
import {NavLink, useNavigate} from "react-router-dom";
import axios from "axios";


const Navbar = () => {

  const navigate = useNavigate();

  const Logout = async() => {
    try {
      await axios.delete(`http://27.112.78.28:5000/logout`);
      navigate("/")
    }catch (error){
      console.log(error);
    }
  }
  
  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      style={{
        backgroundImage: "linear-gradient(135deg, #00ff88, #007bff)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "5px",
      }}
    >
      <div className="navbar-brand">
        <NavLink className="navbar-item" to="/dashboard">
          <span className="icon is-medium">
            <IoMdMedkit size={24} style={{ marginRight: "5px" }} />
          </span>
          <span className="has-text-white is-size-5">ISENA FKTP</span>
        </NavLink >
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button
                onClick={Logout}
                className="button is-light"
                style={{ marginRight: "10px" }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
