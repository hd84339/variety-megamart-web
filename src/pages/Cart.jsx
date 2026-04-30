import React, { useEffect, useState } from "react";
import { getCartAPI, deleteCartAPI } from "../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCartAPI();

      console.log("CART RESPONSE:", res.data);

      setCart(res.data.data || res.data.cart || res.data || []);
    } catch (err) {
      console.log("GET CART ERROR:", err);
    }
  };

  const removeItem = async (product_id) => {
    try {
      await deleteCartAPI(product_id);
      loadCart(); // refresh
    } catch (err) {
      console.log("DELETE CART ERROR:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{item.name || item.title}</h4>

            <p>Qty: {item.quantity}</p>

            <button onClick={() => removeItem(item.product_id || item.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;