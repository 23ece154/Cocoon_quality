
// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import LandingPage from "./components/LandingPage";
// // import Login from "./components/Login";
// // import Signup from "./components/Signup";
// // import CocoonMarket from "./components/CocoonMarket";  // ✅ import

// // function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<LandingPage />} />
// //         <Route path="/login" element={<Login />} />
// //         <Route path="/signup" element={<Signup />} />
// //         <Route path="/cocoon-market" element={<CocoonMarket />} />  {/* ✅ new route */}

// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "./components/LandingPage";
// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import CocoonMarket from "./components/CocoonMarket";
// import Dashboard from "./components/Dashboard";  // ✅ new import

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/cocoon-market" element={<CocoonMarket />} />
//         <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ new route */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CocoonMarket from "./components/CocoonMarket";
import Dashboard from "./components/Dashboard";
import SensorData from "./components/SensorData";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected layout with sidebar */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cocoon-market" element={<CocoonMarket />} />
          <Route path="/live-graphs" element={<SensorData />} />

      </Routes>
    </Router>
  );
}

export default App;
