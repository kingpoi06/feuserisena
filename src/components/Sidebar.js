import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoPerson, IoPricetag, IoHome } from 'react-icons/io5';
import { jwtDecode } from "jwt-decode";
// import Cookies from 'js-cookie';


const Sidebar = () => {

  return (
    <div>
      <aside className="menu pl-2 has-background-white has-shadow">
        <p className="menu-label has-text-primary">General</p>
        <ul className="menu-list">
          <li>
            <NavLink to={"/dashboard"} activeClassName="is-active">
              <span className="icon is-large has-text-primary">
                <IoHome size={24} />
              </span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={"/pasiens"} activeClassName="is-active">
              <span className="icon is-large has-text-primary">
                <IoPricetag size={24} />
              </span>
              <span>Pasien</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
