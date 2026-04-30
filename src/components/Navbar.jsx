import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";



const Navbar = () => {
    
    const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#E60023",
      color: "white"
    }}>
      <img src={logo} alt="logo" style={{ height: "40px" }} />

      <div>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/cart")} style={{ marginLeft: "10px" }} >Cart</button>
      </div>
    </div>
  );
};

export default Navbar;