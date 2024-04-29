import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoPerson } from 'react-icons/io5';
import { jwtDecode } from "jwt-decode";
import Layout from './Layout';

const AuthPasien = () => {
    const [username, setUsername] = useState('');
    const [expire, setExpire] = useState('');
    const [loading, setLoading] = useState(true);
    const [nama, setNama] = useState("");
    const [tgllahir, setTgllahir] = useState("");
    const [umur, setUmur] = useState("");
    const [alamat, setAlamat] = useState("");
    const [norm, setNorm] = useState("");
    const [nobpjs, setNobpjs] = useState("");
    const [msg, setMsg] = useState("");
    const [role, setRole] = useState("");
    const [token, setToken] = useState("");
    const { uuid } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
      refreshToken();
    }, []);
    
    useEffect(() => {
        // Pastikan uuid memiliki nilai yang valid sebelum melakukan permintaan ke server
        if (uuid && uuid !== 'undefined') {
          getPasienById(uuid);
        }
      }, [uuid]);
  
    const refreshToken = async () => {
      try {
        const response = await axios.get('https://isenaauth.onrender.com/token');
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
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
          const response = await axios.get('https://isenaauth.onrender.com/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwtDecode(response.data.accessToken);
          setUsername(decoded.username);
          setExpire(decoded.exp);
          setLoading(false);
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    })
  
    const getPasienById = async (uuid) => { // Terima uuid sebagai argumen
      try {
        const response = await axiosJWT.get(`https://isenaauth.onrender.com/pasiens/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          const pasien = response.data;
          setNama(pasien.nama);
          setTgllahir(pasien.tgllahir);
          setUmur(pasien.umur);
          setAlamat(pasien.alamat);
          setNorm(pasien.norm);
          setNobpjs(pasien.nobpjs);
          setRole(pasien.role);
        }
      } catch (error) {
        console.error('Error getting pasien by ID:', error);
      }
    };
  
    const Authnobpjs = async (e) => {
      e.preventDefault();
      try {
        await axiosJWT.post('https://apiuserisena.onrender.com/loginpasien', {
          nobpjs: nobpjs,
        });
        navigate(`/pasiens/product/${uuid}`);
      } catch (error) {
        if (error.response) {
          console.error('Error:', error.response.data.msg);
        } else {
          console.error('Error:', error.message);
        }
      }
    };
    
    return (
      <Layout>
        <div>
          <form onSubmit={Authnobpjs}>
            <div className="field">
              <label className="label">No BPJS</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input is-success"
                  type="text"
                  placeholder="No BPJS"
                  value={nobpjs}
                  onChange={(e) => setNobpjs(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <IoPerson />
                </span>
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
              </div>
              <p className="help is-success">Harap masukkan No BPJS yang benar</p>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-success">
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </Layout>
    );
}

export default AuthPasien;
