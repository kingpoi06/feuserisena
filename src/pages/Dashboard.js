import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoPerson } from "react-icons/io5";
import Layout from "./Layout";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('https://isenaauth.onrender.com/token');
        const { accessToken, refreshToken } = response.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        // Jika username juga didapatkan dari endpoint, gunakan ini untuk menyetelnya
        // setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        // Lakukan penanganan kesalahan sesuai kebutuhan
      }
    };

    fetchTokens();
  }, []);

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
          <div>
            <p>Access Token: {accessToken}</p>
            <p>Refresh Token: {refreshToken}</p>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Dashboard;
