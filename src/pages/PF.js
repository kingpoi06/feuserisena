import React, {useState, useEffect} from 'react'
import Layout from './Layout'
import { jwtDecode } from 'jwt-decode';
import { useParams, Link } from 'react-router-dom'
import { IoPerson } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PF = () => {
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
    const [pfs, setPFs] = useState([]);
  

  useEffect(() => {
    refreshToken();
    getPFs();
    // deletePasien();
  }, []);

  useEffect(() => {
    console.log("UUID:", uuid);
    if (uuid) {
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

  const deletePF = async (id) => {
    try {
      if (!id) {
        console.error('Error deleting DATA');
        return;
      }
  
      await axiosJWT.delete(`https://isenaauth.onrender.com/pfs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Setelah berhasil menghapus data, panggil getPasiens untuk memperbarui data pasien yang ditampilkan
      getPFs();
    } catch (error) {
      console.error('Error deleting data:', error);
      // Tangani pesan kesalahan dengan metode yang sesuai, misalnya menggunakan react-toastify atau console.error
    }
  };

  const getPFs = async () => {
    try {
        const response = await axiosJWT.get('https://isenaauth.onrender.com/pfs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // Mengurutkan data dari yang terbaru ke yang terlama berdasarkan waktu pembuatan (createdAt)
        const sortedPFs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPFs(sortedPFs);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

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
      <div className="container mx-auto mt-6">
        <div className="container">
        <h2 className="font-bold mb-4">PEMERIKSAAN FISIK</h2>
        <div className="mb-4">
            <Link to="/pfs/add" className="button is-primary">
              PERIKSA
            </Link>
            </div>
        <div className="table-container">
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal Data Dibuat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pfs.map((pf, index) => (
                <tr key={pf.uuid}>
                  <td>{index + 1}</td>
                  <td>{formatDateTime(pf.createdAt)}</td>
                  <td>
                  <Link to={`/pfs/view/${pf.uuid}`} className="button is-small is-success">...</Link>
                    <Link to={`/pfs/edit/${pf.uuid}`} className="button is-small is-info">Edit</Link>
                    <button onClick={() => deletePF(pf.uuid)} className="button is-small is-danger">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default PF
