import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { jwtDecode } from "jwt-decode";

const EditPasien = () => {
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
    console.log("UUID:", uuid);
    if (uuid) {
      getPasienById(uuid);
    }
  }, [uuid]);

  const refreshToken = async () => {
    try {
      const response = await axios.get('https://apiuserisena.onrender.com/token');
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
        const response = await axios.get('https://apiuserisena.onrender.com/token');
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
      const response = await axiosJWT.get(`https://apiuserisena.onrender.com/pasiens/${uuid}`, {
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

  const updatePasiens = async (e) => {
    e.preventDefault();
    try {
      if (!uuid) {
        throw new Error("UUID tidak tersedia");
      }
  
      if (!nama || !tgllahir || !umur || !alamat || !norm || !nobpjs || !role) {
        throw new Error("Silahkan lengkapi semua data pasien");
      }
  
      await axiosJWT.put(`https://apiuserisena.onrender.com/pasiens/${uuid}`, {
        nama,
        tgllahir,
        umur,
        alamat,
        norm,
        nobpjs,
        role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      navigate("/pasiens");
    } catch (error) {
      console.error('Error updating pasien:', error);
      setMsg(error.message);
    }
  };
  
  const handleCancel = () => {
    navigate('/pasiens');
  };
  

    return (
        <Layout>
            <div className="col-span-1">
                <div className="bg-gray-100 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">EDIT PASIEN</h2>
                    <form onSubmit={updatePasiens}>
                        <p className='has-text-centered'>{msg}</p>
                        <div className="field">
                            <div className="control">
                                <label className="label">Nama</label>
                                <input className="input is-success mb-4" value={nama} onChange={(e) => setNama(e.target.value)} type="text" placeholder="Nama" />
                            </div>
                            <div className="control">
                                <label className="label">Tanggal Lahir</label>
                                <input className="input mb-4" value={tgllahir} onChange={(e) => setTgllahir(e.target.value)} type="date" placeholder="Tanggal Lahir" />
                            </div>
                            <div className="control">
                                <label className="label">Umur</label>
                                <input className="input is-success mb-4" value={umur} onChange={(e) => setUmur(e.target.value)} type="text" placeholder="Umur" />
                            </div>
                            <div className="control">
                                <label className="label">Alamat</label>
                                <input className="input is-success mb-4" value={alamat} onChange={(e) => setAlamat(e.target.value)} type="text" placeholder="Alamat" />
                            </div>
                            <div className="control">
                                <label className="label">No Rekam Medis</label>
                                <input className="input is-success mb-4" value={norm} onChange={(e) => setNorm(e.target.value)} type="text" placeholder="No Rekam Medis" />
                            </div>
                            <div className="control">
                                <label className="label">No BPJS</label>
                                <input className="input is-success mb-4" value={nobpjs} onChange={(e) => setNobpjs(e.target.value)} type="text" placeholder="No BPJS" />
                            </div>
                            <div className="control">
                                <label className="label">Role</label>
                                <input className="input is-success mb-4" value={role} onChange={(e) => setRole(e.target.value)} type="text" placeholder="Ketik Pasien" />
                            </div>
                        </div>
                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-success">UPDATE</button>
                            </div>
                            
                            <div className="control">
                                <button className="button is-danger" onClick={handleCancel}>Batal</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default EditPasien;
