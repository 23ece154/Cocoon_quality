import React, { useState, useEffect } from "react"; 
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../styles/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [feeds, setFeeds] = useState([]);
  const [colorText, setColorText] = useState("-");
  const [density, setDensity] = useState("-");
  const [quality, setQuality] = useState("-");
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    location: "",
  });
  const [userDistrict, setUserDistrict] = useState("");
  const [nearestMarket, setNearestMarket] = useState("");
  const [markets, setMarkets] = useState([]);
  const [weight, setWeight] = useState("");
  const [usedPrice, setUsedPrice] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);

  const tamilNaduDistricts = [
    "Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode",
    "Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam",
    "Namakkal","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga",
    "Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli",
    "Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"
  ];

  // ✅ Fetch cocoon data and determine color, density, and quality
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.thingspeak.com/channels/3093763/feeds.json?api_key=2JS7HVP0JHBHDI5J&results=10"
        );
        const data = res.data.feeds;
        setFeeds(data);

        if (data.length > 0) {
          const latest = data[data.length - 1];
          const dens = parseFloat(latest.field3);
          const colName = latest.field2;

          setDensity(latest.field3 || "-");
          setColorText(colName || "-");

          // let densityScore = 1;
          // if (!isNaN(dens)) {
          //   if (dens >= 4) densityScore = 3;
          //   else if (dens >= 2) densityScore = 2;
          // }

          // let colorScore = 1;
          // if (colName === "WHITE") colorScore = 3;
          // else if (colName === "YELLOW") colorScore = 2;

          // const totalScore = densityScore + colorScore;
          // if (totalScore >= 5) setQuality("Best");
          // else if (totalScore >= 3) setQuality("Average");
          // else setQuality("Low");
          if (!isNaN(dens)) {
            if (dens >= 4 && colName === "WHITE") setQuality("Best");
            else if (dens >= 2.5 && (colName === "WHITE" || colName === "YELLOW")) setQuality("Average");
            else setQuality("Low");
          } else {
            setQuality("-");
          }

        }
      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load logged-in user
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setEditData({
        username: loggedInUser.username,
        email: loggedInUser.email,
        location: loggedInUser.location || "",
      });
      if (loggedInUser.location) setUserDistrict(loggedInUser.location);
    }
  }, []);

  const handleEditChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const saveProfile = () => {
    const updatedUser = { ...user, ...editData, location: userDistrict };
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ✅ Fetch market data when district changes
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/scrape/cocoon");
        const data = res.data.data;
        setMarkets(data);

        // ✅ Map districts to their nearest markets
        const districtMarketMap = {
          Tirupur: "Udumalpet",
          Erode: "Rasipuram",
          Coimbatore: "Coimbatore",
          Salem: "Salem",
          Dharmapuri: "Dharmapuri",
          Krishnagiri: "Hosur",
          Vellore: "Vaniambadi",
          Theni: "Theni",
          Nagapattinam: "Dharmapuri", // ✅ Added based on your screenshot
        };

        const nearest =
          districtMarketMap[userDistrict] || data[0]?.market || "Unknown";
        setNearestMarket(nearest);
      } catch (err) {
        console.error("Error fetching market data:", err);
      }
    };

    if (userDistrict) fetchMarketData();
  }, [userDistrict]);

  // ✅ Calculate market price based on quality
  useEffect(() => {
    if (!nearestMarket || !markets.length) return;

    const market = markets.find((m) => m.market === nearestMarket);
    if (!market) return;

    const max = Number(market.maxPrice) || 0;
    const avg = Number(market.avgPrice) || 0;
    const min = Number(market.minPrice) || 0;

    // ✅ Use average price if quality = "Average"
    let pricePerKg = avg;
    if (quality === "Best") pricePerKg = max;
    else if (quality === "Average") pricePerKg = avg;
    else pricePerKg = min;

    setUsedPrice(pricePerKg);
    if (weight) setPredictedPrice((pricePerKg * weight).toFixed(2));
  }, [quality, nearestMarket, markets, weight]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>🦋 SilkHue</h2>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/cocoon-market" className="nav-link">Market</a>
          <a href="/dashboard" className="nav-link active">Dashboard</a>
          <a href="/live-graphs" className="nav-link">Live Graphs</a>
        </nav>

        <div className="header-profile">
          <p className="profile-text" onClick={() => setShowProfile(!showProfile)}>Profile</p>
          {showProfile && (
            <div className="profile-dropdown">
              {user ? (
                !editMode ? (
                  <>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Location:</strong> {userDistrict}</p>
                    <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                  </>
                ) : (
                  <>
                    <input type="text" name="username" value={editData.username} onChange={handleEditChange} />
                    <input type="email" name="email" value={editData.email} onChange={handleEditChange} />
                    <select value={userDistrict} onChange={(e) => setUserDistrict(e.target.value)}>
                      <option value="">Select District</option>
                      {tamilNaduDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <button className="save-btn" onClick={saveProfile}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                )
              ) : (
                <p>Please login</p>
              )}
            </div>
          )}
        </div>
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
        <div className="analysis-graph-container">
          <div className="single-card">
            <h3>Cocoon Quality Analysis</h3>
            <p><strong>Predicted Color:</strong> {colorText}</p>
            <p><strong>Density (IR Voltage):</strong> {density}</p>
            <p>
              <strong>Quality:</strong>{" "}
              <span style={{ color: quality === "Best" ? "green" : quality === "Average" ? "orange" : "red" }}>
                {quality}
              </span>
            </p>

            <div className="market-card">
              <h4>Market Prediction</h4>
              <p><strong>Your District:</strong></p>
              <select
                value={userDistrict}
                onChange={(e) => setUserDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                {tamilNaduDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <p><strong>Nearest Market:</strong> {nearestMarket}</p>
              <p><strong>Market Price (₹/kg):</strong> {usedPrice !== null ? usedPrice : "N/A"}</p>

              <div className="price-calc">
                <input
                  type="number"
                  placeholder="Enter cocoon weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              {weight && usedPrice && (
                <p className="predicted-price">
                  💰 <strong>Estimated Price:</strong> ₹{predictedPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
