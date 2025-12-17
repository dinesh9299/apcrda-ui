// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import DashboardLayout from "./layouts/DashboardLayout";
// import ProtectedRoute from "./routes/ProtectedRoute";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <Dashboard />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LocationDetails from "./pages/LocationDetails";

import A1 from "./pages/A1";
import A2 from "./pages/A2";
import A3 from "./pages/A3";
import A4 from "./pages/A4";
import A5 from "./pages/A5";

import L1 from "./pages/L1";
import L2 from "./pages/L2";
import L3 from "./pages/L3";

import Locations from "./pages/Locations";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<A5 />} />
          <Route path="/locations" element={<L3 />} />
          <Route path="/locations/:id" element={<LocationDetails />} />

          <Route path="/1" element={<A1 />} />
          <Route path="/2" element={<A2 />} />
          <Route path="/3" element={<A3 />} />
          <Route path="/4" element={<A4 />} />
          <Route path="/5" element={<A5 />} />

          <Route path="/l1" element={<L1 />} />
          <Route path="/l2" element={<L2 />} />
          <Route path="/l3" element={<L3 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
