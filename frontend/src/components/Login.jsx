

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    
    
    localStorage.setItem("token", res.data.token);

   
    localStorage.setItem("loggedInUser", JSON.stringify(res.data.user));

    setMsg("Login successful! Welcome " + res.data.user.username);


    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    setMsg(err.response?.data?.msg || "Error occurred");
  }
};


  return (
    <div className="center-container">
      <div className="auth-container">
        
        <div className="auth-left">
          <h2>Welcome to Our Website</h2>
          <p>Connect, explore and enjoy a seamless experience with us.</p>
        </div>

     
        <div className="auth-right">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
          </form>
          <p>{msg}</p>
          <p style={{ marginTop: "10px" }}>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
