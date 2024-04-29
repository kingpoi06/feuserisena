import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { IoPerson } from "react-icons/io5";
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [expire, setExpire] = useState('');

  useEffect(() => {
    refreshToken();
  }, []);   

  const refreshToken = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        navigate("/");
        return;
      }

      const response = await axios.get('https://apiuserisena.onrender.com/token', {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });

      const accessToken = response.data.accessToken;
      const decoded = jwtDecode(accessToken);

      // Periksa apakah token akses masih berlaku
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        navigate("/"); // Arahkan ke halaman login jika token akses kedaluwarsa
        return;
      }

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

  return (
    <Layout>
      <div className="container mx-auto mt-6">
        <div className="columns is-centered">
          <div className="column is-6">
            <div className="box">
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control has-icons-left">
                      <input className="input" type="text" value={username} readOnly />
                      <span className="icon is-small is-left">
                        <IoPerson />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section">
          <h1 className="title">ISENA FKTP</h1>
          <h2 className="subtitle">
            Selamat datang di <strong>ISENA FKTP</strong>. Website ini masih dalam tahap uji coba.
          </h2>
        </section>
      </div>
    </Layout>
  )
}

export default Dashboard;
