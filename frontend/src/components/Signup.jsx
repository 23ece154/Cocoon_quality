import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      setMsg(res.data.msg);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div className="center-container">
      <div className="auth-container">
        
        <div className="auth-left">
          <h2>Join Our Community</h2>
          <p>
            Create your free account today and enjoy personalized features,
            secure access, and much more.
          </p>
        </div>

        <div className="auth-right">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Signup</button>
          </form>
          <p>{msg}</p>
          <p style={{ marginTop: "10px" }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
