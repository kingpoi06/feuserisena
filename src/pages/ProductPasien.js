import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { jwtDecode } from 'jwt-decode';
import { useParams, Link } from 'react-router-dom'
import { IoPerson } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ProductPasien = () => {
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
    // getPasiens();
    // deletePasien();
  }, []);

  useEffect(() => {
    console.log("UUID:", uuid);
    if (uuid && uuid !== 'undefined') { // Memastikan uuid memiliki nilai yang valid
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
                      {/* Mengubah value menjadi nobpjs */}
                      <input className="input" type="text" value={nama} readOnly />
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
          <h2 className="font-bold mb-4 is-primary">FORM PASIEN</h2>
          <div className="mb-4">
            {/* Menambahkan penanganan jika uuid tidak valid */}
            {uuid && uuid !== 'undefined' &&
              <Link to={`/pasiens/product/pfs/${uuid}`} className="button is-primary">
                PEMERIKSAAN FISIK
              </Link>
            }
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default ProductPasien
