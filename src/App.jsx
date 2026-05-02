import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Don't forget this!
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

function App() {
  // Use state so React re-renders when the user logs in/out
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    // Listen for the 'storage' or custom event to update login state
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes - Anyone can see these */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Auth Routes - Only for logged-out users */}
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
          </>
        ) : (
          /* Redirect login/signup to home if already logged in */
          <>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/register" element={<Navigate to="/" />} />
          </>
        )}

        {/* Private Routes - Only for logged-in users */}
        <Route 
          path="/cart" 
          element={token ? <Cart /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/checkout" 
          element={token ? <Checkout /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/orders" 
          element={token ? <Orders /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={token ? <Profile /> : <Navigate to="/login" />} 
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;