import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import { jwtDecode } from 'jwt-decode';
// const { isError } = useSelector((state) => state.auth);
// import { Link } from 'react-router-dom';

const AddPasien = () => {
  const [nama, setNama] = useState("");
  const [tgllahir, setTgllahir] = useState("");
  const [umur, setUmur] = useState("");
  const [alamat, setAlamat] = useState("");
  const [norm, setNorm] = useState("");
  const [nobpjs, setNobpjs] = useState("");
  const [msg, setMsg] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState('');
  const [expire, setExpire] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState('');
//   const [pasiens, setPasiens] = useState([]);

  useEffect(() => {
    refreshToken();
    // postPasiens();
    // getPasiens();
    // deletePasien();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
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
        const response = await axios.get('http://localhost:5000/token');
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

  const postPasiens = async (e) => {
    e.preventDefault();
    try {
      // Validasi apakah semua field telah diisi
      if (!nama || !tgllahir || !umur || !alamat || !norm || !nobpjs || !role) {
        throw new Error("Silahkan lengkapi semua data pasien");
      }
  
      const response = await axiosJWT.post('https://apiuserisena.onrender.com/pasiens', {
        nama: nama,
        tgllahir: tgllahir,
        umur: umur,
        alamat: alamat,
        norm: norm,
        nobpjs: nobpjs,
        role: role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      navigate('/pasiens');
      console.log(response.data);
    } catch (error) {
      // Tangani kesalahan dengan memberikan pesan yang sesuai
      console.error('Error adding pasien:', error.message);
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
          <h2 className="text-2xl font-bold mb-4">DAFTAR PASIEN</h2>
          <form onSubmit={postPasiens}>
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
                <button className="button is-success">Daftar</button>
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

export default AddPasien
