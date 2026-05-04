import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/HomePage/Home";
import ProductDetail from "./pages/ProductDetailPage/ProductDetail";
import Cart from "./pages/CartPage/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Don't forget this!
import Orders from "./pages/OrdersPage/Orders";
import Checkout from "./pages/CheckoutPage/Checkout";
import Profile from "./pages/ProfilePage/Profile";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategoryPage/SubCategory";
import OrderDetail from "./pages/OrderDetailPage/OrderDetail";
import PolicyPage from "./pages/PolicyPage/PolicyPage";

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
        <Route path="/category/:id" element={<Category />} />
         <Route path="/subcategory/:id" element={<SubCategory />} />
         <Route path="/privacy-policy" element={<PolicyPage />} />
         <Route path="/terms-of-service" element={<PolicyPage />} />
         <Route path="/return-policy" element={<PolicyPage />} />

        {/* Auth Routes - Only for logged-out users */}
        {!token ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        ) : (
          /* Redirect login/signup to home if already logged in */

          <>

            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            
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
        <Route 
          path="/order/:id"
          element={token ? <OrderDetail /> : <Navigate to="/login" />} 
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;