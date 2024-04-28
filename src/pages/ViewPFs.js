import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { jwtDecode } from "jwt-decode";

const ViewPFs = () => {
    const [pfData, setPfData] = useState({
        unitpelayanan: "",
        keluhanutama: "",
        keluhantambahan: "",
        riwayatpenyakitsekarang: "",
        riwayatpenyakitdahulu: "",
        riwayatpenyakitkeluarga: "",
        riwayatalergi: "",
        terapiyangpernahdijalani: "",
        obatnyangseringdigunakan: "",
        obatyangsedangdikonsumsi: "",
        keadaanumum: "",
        kesadaranGCS: "",
        tekanandarah: "",
        nadi: "",
        suhu: "",
        freknafas: "",
        beratbadan: "",
        tinggibadan: "",
        imtBBTB: "",
        kepala: "",
        thorax: "",
        abdormen: "",
        ekstremitas: "",
        lainnya: "",
        statusmental: "",
        responemosi: "",
        hubunganpasiendengankeluarga: "",
        ketaatanmenjalaniibadah: "",
        bahasa: ""
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [expire, setExpire] = useState('');
    const [msg, setMsg] = useState("");
    const { uuid } = useParams();

    useEffect(() => {
        refreshToken();
    }, []);
    
    useEffect(() => {
        if (uuid) {
            getPFsById(uuid);
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
      
    const getPFsById = async (uuid) => {
        try {
            const response = await axiosJWT.get(`https://apiuserisena.onrender.com/pfs/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const { id, uuid, createdAt, updatedAt, pasien, pasienId, ...data } = response.data; // Menghilangkan id, uuid, createdAt, dan updatedAt
                setPfData(data);
            }
        } catch (error) {
            console.error('Error getting pf by ID:', error);
        }
    };

    const handleCancel = () => {
        navigate(`/pasiens/product/pfs/${uuid}`);
    };

    return (
        <Layout>
            <div className="col-span-1">
                <div className="bg-gray-100 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">PEMERIKSAAN FISIK</h2>
                    <div className="field">
                        {/* Render input fields with values from pfData */}
                        {Object.keys(pfData).map((key) => (
                            <div className="control" key={key}>
                                <label className="label">{key}</label>
                                <div className="input is-success mb-4">
                                    {pfData[key]}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button className="button is-danger" onClick={handleCancel}>Batal</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ViewPFs;
