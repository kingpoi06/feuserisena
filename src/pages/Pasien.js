import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';


const Pasien = () => {
  const [username, setUsername] = useState('');
  const [expire, setExpire] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [pasiens, setPasiens] = useState([]);

  useEffect(() => {
    refreshToken();
    getPasiens();
    // deletePasien();
  }, []);

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

  const getPasiens =  async()=>{
    const response = await axiosJWT.get('https://apiuserisena.onrender.com/pasiens',{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
    setPasiens(response.data)
  }

  const deletePasien = async (id) => {
    try {
      if (!id) {
        console.error('Error deleting pasien: pasienId is undefined');
        return;
      }
  
      await axiosJWT.delete(`https://apiuserisena.onrender.com/pasiens/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Setelah berhasil menghapus data, panggil getPasiens untuk memperbarui data pasien yang ditampilkan
      getPasiens();
    } catch (error) {
      console.error('Error deleting pasien:', error);
      // Tangani pesan kesalahan dengan metode yang sesuai, misalnya menggunakan react-toastify atau console.error
    }
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    };
    return dateTime.toLocaleString('id-ID', options);
  }

  return (
    <Layout>
      <div className="container">
        <h2 className="font-bold mb-4">Daftar Pasien</h2>
        <div className="mb-4">
          <Link to="/pasiens/add" className="button is-primary">Tambah Pasien</Link>
        </div>
        <div className="table-container">
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Nomor BPJS</th>
                <th>No Rekam Medis</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pasiens.map((pasien, index) => (
                <tr key={pasien.uuid}>
                  <td>{index + 1}</td>
                  <td>{pasien.nama}</td>
                  <td>{pasien.nobpjs}</td>
                  <td>{formatDateTime(pasien.createdAt)}</td>
                  <td>
                  <Link to={`/pasiens/auth/${pasien.uuid}`} className="button is-small is-success">...</Link>
                    <Link to={`/pasiens/edit/${pasien.uuid}`} className="button is-small is-info">Edit</Link>
                    <button onClick={() => deletePasien(pasien.uuid)} className="button is-small is-danger">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default Pasien
