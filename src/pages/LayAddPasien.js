// import React, { useEffect } from 'react'
// import Layout from './Layout'
// import AddPasien from './AddPasien'
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const LayAddPasien = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { isError } = useSelector((state) => state.auth);

//     useEffect(() => {
//         if (isError) {
//           navigate("/");
//         }
//       }, [isError, navigate]);

//   return (
//     <Layout>
//         <AddPasien/>
//     </Layout>
//   )
// }

// export default LayAddPasien
