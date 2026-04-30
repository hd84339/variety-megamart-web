import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await loginUser(mobile, password);

//       console.log(res.data);

//       // store token (check actual response key)
//       localStorage.setItem("token", res.data.token);

//       alert("Login successful");

//       navigate("/");
//     } catch (err) {
//       alert("Login failed");
//       console.log(err);
//     }
//   };
const handleLogin = async () => {
  try {
    const res = await loginUser(mobile, password);

    console.log("FULL RESPONSE:", res.data);

    // 🔥 get token safely
    const token =
      res.data.token ||
      res.data.data?.token ||
      res.data.access_token;

    if (!token) {
      alert("Token not found. Check API response.");
      return;
    }

    // store token
    localStorage.setItem("token", token);

    alert("Login successful");

    navigate("/");
  } catch (err) {
    console.log(err);
    alert("Login failed");
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;