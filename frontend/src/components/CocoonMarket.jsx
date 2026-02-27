


import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CocoonMarket.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CocoonMarket() {
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/scrape/cocoon", {
          headers: { Authorization: `Bearer ${token}` },
        });

        let rawData = [];
        if (Array.isArray(res.data.data)) {
          rawData = res.data.data;
        } else {
          setMsg("Unexpected response: " + JSON.stringify(res.data));
          return;
        }

        const fixedData = rawData.map((row) => ({
          date: row.date || "-",
          market: row.market || "-",
          minPrice: row.variety && row.variety !== "-" ? Number(row.variety) : 0,
          maxPrice: row.minPrice && row.minPrice !== "-" ? Number(row.minPrice) : 0,
          avgPrice: row.maxPrice && row.maxPrice !== "-" ? Number(row.maxPrice) : 0,
        }));

        setData(fixedData);
      } catch (err) {
        console.error(err);
        setMsg(err.response?.data?.msg || "Error fetching cocoon prices");
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((row) => row.market),
    datasets: [
      {
        label: "Min Price",
        data: data.map((row) => row.minPrice),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Max Price",
        data: data.map((row) => row.maxPrice),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Average Price",
        data: data.map((row) => row.avgPrice),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Cocoon Market Prices" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="dashboard-header">
        <h2>🦋 SilkHue</h2>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/cocoon-market" className="nav-link active">Market</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/live-graphs" className="nav-link">Live Graphs</a>
        </nav>

      </header>

      <main className="dashboard-main">
        <div className="cocoon-table-container" style={{ width: "90%", maxWidth: "1000px", margin: "50px auto" }}>
          <h2 style={{ textAlign: "center" }}>Cocoon Market Prices</h2>
          {msg && <p className="cocoon-msg">{msg}</p>}

          {data.length > 0 ? (
            <>
              <table className="cocoon-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Market</th>
                    <th>Min Price</th>
                    <th>Max Price</th>
                    <th>Average Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{row.market}</td>
                      <td>{row.minPrice}</td>
                      <td>{row.maxPrice}</td>
                      <td>{row.avgPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: 30, background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <Bar data={chartData} options={options} />
              </div>
            </>
          ) : (
            !msg && <p style={{ textAlign: "center" }}>Loading...</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default CocoonMarket;
