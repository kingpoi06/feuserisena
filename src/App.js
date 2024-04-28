import Login from "./components/Login"
import Dashboard from "./pages/Dashboard"
import Pasien from "./pages/Pasien";
import AddPasien from "./pages/AddPasien";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EditPasien from "./pages/EditPasien";
import ProductPasien from "./pages/ProductPasien";
import PF from "./pages/PF";
import AddPFs  from './pages/AddPFs';
import AuthPasien from "./pages/AuthPasien";
import EditPFs from "./pages/EditPFs";
import ViewPFs from "./pages/ViewPFs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}/> 
        <Route path="/pasiens" element={<Pasien />}/> 
        <Route path="/pasiens/add" element={<AddPasien />} />
        <Route path="/pasiens/edit/:uuid" element={<EditPasien />} />
        <Route path="/pasiens/auth/:uuid" element={<AuthPasien />} />
        <Route path="/pasiens/product/:uuid" element={<ProductPasien />} />
        <Route path="/pasiens/product/pfs/:uuid" element={<PF />} />
        <Route path="/pfs/add" element={<AddPFs />} />
        <Route path="/pfs/edit/:uuid" element={<EditPFs />} />
        <Route path="/pfs/view/:uuid" element={<ViewPFs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
