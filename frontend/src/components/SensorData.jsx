import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles/Dashboard.css"; // reuse dashboard styles

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SensorData = () => {
  const [feeds, setFeeds] = useState([]);

  // Fetch live data from ThingSpeak
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.thingspeak.com/channels/3093763/feeds.json?api_key=2JS7HVP0JHBHDI5J&results=10"
      );
      const data = await response.json();
      setFeeds(data.feeds || []);
    } catch (error) {
      console.error("Error fetching ThingSpeak data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Extract timestamps and sensor values
  const labels = feeds.map((f) =>
    new Date(f.created_at).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );

  const irVoltages = feeds.map((f) => parseFloat(f.field3) || 0);
  const colorValues = feeds.map((f) => parseFloat(f.field1) || 0);

  // Map predicted quality based on density and color
  // const predictedQualityValues = feeds.map((f) => {
  //   const dens = parseFloat(f.field3);
  //   const colName = f.field2;

  //   if (dens > 3 && colName === "WHITE") return 3; // Excellent
  //   else if (dens >= 2.5 && (colName === "WHITE" || colName === "YELLOW")) return 2; // Good
  //   else return 1; // Poor
  // });

      const predictedQualityValues = feeds.map((f) => {
      const dens = parseFloat(f.field3);
      const colName = f.field2;

      if (!isNaN(dens)) {
        if (dens >= 4 && colName === "WHITE") return 3; // Best
        else if (dens >= 2.5 && (colName === "WHITE" || colName === "YELLOW")) return 2; // Average
        else return 1; // Low
      }
      return 0;
    });


  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "IR Voltage (V)",
        data: irVoltages,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // soft teal
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Color Sensor Value",
        data: colorValues,
        backgroundColor: "rgba(255, 99, 132, 0.6)", // soft red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Predicted Quality",
        data: predictedQualityValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)", // soft blue
        borderColor: "rgba(54, 162, 235, 0.6)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#333",
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: "Real-Time IR, Color & Predicted Quality (Cocoon Analysis)",
        font: { size: 16, weight: "bold" },
        color: "#2e7d32",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (HH:MM:SS)",
          color: "#2e7d32",
        },
        ticks: { color: "#444" },
        grid: { color: "#eee" },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sensor Values / Predicted Quality (1-Poor,2-Good,3-Excellent)",
          color: "#2e7d32",
        },
        ticks: { color: "#444", stepSize: 1, min: 0, max: 3 },
        grid: { color: "#eee" },
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="dashboard-header">
        <h2>🦋 SilkHue</h2>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/cocoon-market" className="nav-link">Market</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/live-graphs" className="nav-link active">Live Graphs</a>
        </nav>
      </header>

      <main className="dashboard-main"  style={{
    marginTop: "110px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    boxSizing: "border-box",
    overflowX: "hidden",
  }}>
        <div
          style={{
            width: "85%",
            maxWidth: "1000px",
            height: "500px",
            margin: "50px auto",
            background: "#fff",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Bar data={chartData} options={options} />
        </div>
      </main>
    </div>
  );
};

export default SensorData;
