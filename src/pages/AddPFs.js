import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { jwtDecode } from 'jwt-decode';

const AddPFs = () => {
  const [unitpelayanan, setUnitpelayanan] = useState("");
  const [keluhanutama, setKeluhanutama] = useState("");
  const [keluhantambahan, setKeluhantambahan] = useState("");
  const [riwayatpenyakitsekarang, setRiwayatpenyakitsekarang] = useState("");
  const [riwayatpenyakitdahulu, setRiwayatpenyakitdahulu] = useState("");
  const [riwayatpenyakitkeluarga, setRiwayatpenyakitkeluarga] = useState("");
  const [riwayatalergi, setRiwayatalergi] = useState("");
  const [terapiyangpernahdijalani, setTerapiyangpernahdijalani] = useState("");
  const [obatnyangseringdigunakan, setObatnyangseringdigunakan] = useState("");
  const [obatyangsedangdikonsumsi, setObatyangsedangdikonsumsi] = useState("");
  const [keadaanumum, setKeadaanumum] = useState("");
  const [kesadaranGCS, setKesadaranGCS] = useState("");
  const [tekanandarah, setTekanandarah] = useState("");
  const [nadi, setNadi] = useState("");
  const [suhu, setSuhu] = useState("");
  const [freknafas, setFreknafas] = useState("");
  const [beratbadan, setBeratbadan] = useState("");
  const [tinggibadan, setTinggibadan] = useState("");
  const [imtBBTB, setImtBBTB] = useState("");
  const [kepala, setKepala] = useState("");
  const [thorax, setThorax] = useState("");
  const [abdormen, setAbdormen] = useState("");
  const [ekstremitas, setEkstremitas] = useState("");
  const [lainnya, setLainnya] = useState("");
  const [statusmental, setStatusmental] = useState("");
  const [responemosi, setResponemosi] = useState("");
  const [hubunganpasiendengankeluarga, setHubunganpasiendengankeluarga] = useState("");
  const [ketaatanmenjalaniibadah, setKetaatanmenjalaniibadah] = useState("");
  const [bahasa, setBahasa] = useState("");
  const [username, setUsername] = useState('');
  const [expire, setExpire] = useState('');
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const { uuid } = useParams();

  useEffect(() => {
    refreshToken();
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

  const postPFs = async (e) => {
    e.preventDefault();
    try {
      // Validasi apakah semua field telah diisi
      if (!unitpelayanan ||
        !keluhanutama || !keluhantambahan || !riwayatpenyakitsekarang || 
        !riwayatpenyakitdahulu || !riwayatpenyakitkeluarga || !riwayatalergi || 
        !terapiyangpernahdijalani || !obatnyangseringdigunakan || !obatyangsedangdikonsumsi ||
        !keadaanumum || !kesadaranGCS || !tekanandarah || !nadi || !suhu || !freknafas ||
        !beratbadan || !tinggibadan || !imtBBTB || !kepala || !thorax || !abdormen || !ekstremitas || !lainnya ||
        !statusmental || !responemosi || !hubunganpasiendengankeluarga || !ketaatanmenjalaniibadah || !bahasa) {
        throw new Error("Silahkan lengkapi semua data FORM");
      }
  
      const response = await axiosJWT.post('https://apiuserisena.onrender.com/pfs', {
        unitpelayanan: unitpelayanan,
        keluhanutama: keluhanutama,
        keluhantambahan: keluhantambahan,
        riwayatpenyakitsekarang: riwayatpenyakitsekarang,
        riwayatpenyakitdahulu: riwayatpenyakitdahulu,
        riwayatpenyakitkeluarga: riwayatpenyakitkeluarga,
        riwayatalergi: riwayatalergi,
        terapiyangpernahdijalani: terapiyangpernahdijalani,
        obatnyangseringdigunakan: obatnyangseringdigunakan,
        obatyangsedangdikonsumsi: obatyangsedangdikonsumsi,
        keadaanumum: keadaanumum,
        kesadaranGCS: kesadaranGCS,
        tekanandarah: tekanandarah,
        nadi: nadi,
        suhu: suhu,
        freknafas: freknafas,
        beratbadan: beratbadan,
        tinggibadan: tinggibadan,
        imtBBTB: imtBBTB,
        kepala: kepala,
        thorax: thorax,
        abdormen: abdormen,
        ekstremitas: ekstremitas,
        lainnya: lainnya,
        statusmental: statusmental,
        responemosi: responemosi,
        hubunganpasiendengankeluarga: hubunganpasiendengankeluarga,
        ketaatanmenjalaniibadah: ketaatanmenjalaniibadah,
        bahasa: bahasa,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      navigate(`/pasiens/product/pfs/${uuid}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error adding pasien:', error.message);
      setMsg(error.message);
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
          <form onSubmit={postPFs}>
            <p className='has-text-centered'>{msg}</p>
            <div className="field">
              <div className="control">
                <label className="label">Unit Pelayanan</label>
                <input className="input is-success mb-4" value={unitpelayanan} onChange={(e) => setUnitpelayanan(e.target.value)} type="text" placeholder="Unit Pelayanan" />
              </div>
              <div className="control">
                <label className="label">Keluhan Utama</label>
                <input className="input is-success mb-4" value={keluhanutama} onChange={(e) => setKeluhanutama(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Keluhan Tambahan</label> 
                <input className="input is-success mb-4" value={keluhantambahan} onChange={(e) => setKeluhantambahan(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Riwayat Penyakit Saat Ini</label>
                <input className="input is-success mb-4" value={riwayatpenyakitsekarang} onChange={(e) => setRiwayatpenyakitsekarang(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Riwayat Penyakit Terdahulu</label>
                <input className="input is-success mb-4" value={riwayatpenyakitdahulu} onChange={(e) => setRiwayatpenyakitdahulu(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Riwayat Penyakit Keluarga</label>
                <input className="input is-success mb-4" value={riwayatpenyakitkeluarga} onChange={(e) => setRiwayatpenyakitkeluarga(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Riwayat Alergi</label>
                <input className="input is-success mb-4" value={riwayatalergi} onChange={(e) => setRiwayatalergi(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Terapi yang Pernah Dijalani</label>
                <input className="input is-success mb-4" value={terapiyangpernahdijalani} onChange={(e) => setTerapiyangpernahdijalani(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Obat Yang Sering Digunakan</label>
                <input className="input is-success mb-4" value={obatnyangseringdigunakan} onChange={(e) => setObatnyangseringdigunakan(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Obat yang Sering Dikonsumsi</label>
                <input className="input is-success mb-4" value={obatyangsedangdikonsumsi} onChange={(e) => setObatyangsedangdikonsumsi(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Keadaan Umum</label>
                <input className="input is-success mb-4" value={keadaanumum} onChange={(e) => setKeadaanumum(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Kesadaran GCS</label>
                <input className="input is-success mb-4" value={kesadaranGCS} onChange={(e) => setKesadaranGCS(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Tekanan Darah</label>
                <input className="input is-success mb-4" value={tekanandarah} onChange={(e) => setTekanandarah(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Nadi</label>
                <input className="input is-success mb-4" value={nadi} onChange={(e) => setNadi(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Suhu</label>
                <input className="input is-success mb-4" value={suhu} onChange={(e) => setSuhu(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Frekuensi Nafas</label>
                <input className="input is-success mb-4" value={freknafas} onChange={(e) => setFreknafas(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Berat Badan</label>
                <input className="input is-success mb-4" value={beratbadan} onChange={(e) => setBeratbadan(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Tinggi Badan</label>
                <input className="input is-success mb-4" value={tinggibadan} onChange={(e) => setTinggibadan(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">IMT BBTB</label>
                <input className="input is-success mb-4" value={imtBBTB} onChange={(e) => setImtBBTB(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Kepala</label>
                <input className="input is-success mb-4" value={kepala} onChange={(e) => setKepala(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Thorax</label>
                <input className="input is-success mb-4" value={thorax} onChange={(e) => setThorax(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Abdormen</label>
                <input className="input is-success mb-4" value={abdormen} onChange={(e) => setAbdormen(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">ekstremitas</label>
                <input className="input is-success mb-4" value={ekstremitas} onChange={(e) => setEkstremitas(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Lainnya</label>
                <input className="input is-success mb-4" value={lainnya} onChange={(e) => setLainnya(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Status Mental</label>
                <input className="input is-success mb-4" value={statusmental} onChange={(e) => setStatusmental(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Respon Emosi</label>
                <input className="input is-success mb-4" value={responemosi} onChange={(e) => setResponemosi(e.target.value)} type="text" placeholder="Nama" />
              </div>
              <div className="control">
                <label className="label">Hubungan Pasien Dengan Keluarga</label>
                <input className="input is-success mb-4" value={hubunganpasiendengankeluarga} onChange={(e) => setHubunganpasiendengankeluarga(e.target.value)} type="text" placeholder="" />
              </div>
              <div className="control">
                <label className="label">Ketaatan Menjalani Ibadah</label>
                <input className="input is-success mb-4" value={ketaatanmenjalaniibadah} onChange={(e) => setKetaatanmenjalaniibadah(e.target.value)} type="text" placeholder="Ketaatan Menjalani Ibadah" />
              </div>
              <div className="control">
                <label className="label">Bahasa</label>
                <input className="input is-success mb-4" value={bahasa} onChange={(e) => setBahasa(e.target.value)} type="text" placeholder="Bahasa" />
              </div>
              
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-success">Selesai</button>
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

export default AddPFs
