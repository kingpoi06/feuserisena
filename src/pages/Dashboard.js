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
  const [token, setToken] = useState("");

  useEffect(() => {
    refreshToken(); 
    
    const refreshInterval = setInterval(() => {
      refreshToken();
    }, 60000); 
    
    return () => clearInterval(refreshInterval); 
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('https://apiuserisena.onrender.com/token');
      const accessToken = response.data.accessToken; // Simpan token dari respons
      setToken(accessToken); // Simpan token dalam state
      const decoded = jwtDecode(accessToken);
      setUsername(decoded.username);
      setExpire(decoded.exp);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing token:', error);
      setLoading(false);
      if(error.response){
        navigate("/");
      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date();
    if(expire * 1000 < currentDate.getTime()){
        config.headers.Authorization = `Bearer ${token}`; // Gunakan token dari state
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  })

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
