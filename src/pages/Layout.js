import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
// import Main from "../components/Main";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
<div className="columns has-background-light" style={{ marginTop: '65px', height: '100vh' }}>
  <div className="column is-2 has-background-white sidebar" style ={{marginLeft: '10px'}}>
    <Sidebar />
  </div>
  <div className="column is-main " style={{ marginRight: '100px',marginLeft: '100px',marginTop: '50px', paddingRight: '100px', paddingLeft: '100px'}}>
  <div className="column has-background-white main"style ={{marginRight: '10px'}}>
    <main>{children}</main>
  </div>
</div>
</div>
<style jsx>{`
  .sidebar {
    border-right: 3px solid #ddd; /* Tambahkan garis kanan pada sidebar */
    padding-right: 20px; /* Tambahkan ruang di sebelah kanan sidebar */
  }
  .main {
    padding-left: 20px; /* Tambahkan ruang di sebelah kiri konten utama */
  }
`}</style>
    </React.Fragment>
  );
};



export default Layout;
