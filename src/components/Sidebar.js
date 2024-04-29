import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoPerson, IoPricetag, IoHome } from 'react-icons/io5';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';


const Sidebar = () => {
  const [username, setUsername] = useState('');
  const [expire, setExpire] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  // const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    
  }, []);
  

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        navigate("/dashboard");
        return;
      }

      const response = await axios.get('https://apiuserisena.onrender.com/token', {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setUsername(decoded.username);
      setExpire(decoded.exp);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing token:', error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        navigate("/");
      }
    }
  }

  // Intercept request untuk memperbarui token
  axios.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      // Ambil refresh token dari cookie
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        // Kirim permintaan untuk memperbarui token dengan refresh token
        const response = await axios.get('https://apiuserisena.onrender.com/token', {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        });

        // Perbarui token dalam config
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setUsername(decoded.username);
        setExpire(decoded.exp);
      } else {
        // Token tidak tersedia, arahkan pengguna untuk login kembali
        navigate("/");
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });



  

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
