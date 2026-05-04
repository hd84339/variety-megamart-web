import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, ArrowLeft } from "lucide-react";
import { getCartAPI, deleteCartAPI, addToCartAPI } from "../../services/cartService";
import CartItem from "./components/CartItem";
import PaymentSelector from "./components/PaymentSelector";
import OrderSummary from "./components/OrderSummary";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCartAPI();
      let items = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        items = res.data.data;
      } else if (res.data?.cart && Array.isArray(res.data.cart)) {
        items = res.data.cart;
      } else if (res.data?.cart?.items && Array.isArray(res.data.cart.items)) {
        items = res.data.cart.items;
      } else if (res.data?.items && Array.isArray(res.data.items)) {
        items = res.data.items;
      }
      setCart(items);
    } catch (err) {
      console.log("GET CART ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item) => {
    const vId = item.variation_id || item.product_variation_id || item.id;
    const pId = item.product_id || item.product?.id;
    const cId = item.id;

    const idsToTry = [
      { product_id: pId, variation_id: vId },
      { cart_id: cId },
      { variation_id: vId },
      { id: cId }
    ];

    for (const payload of idsToTry) {
      try {
        await deleteCartAPI(payload);
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return;
      } catch (err) {
        console.log("Removal attempt failed:", payload);
      }
    }
    alert("Failed to remove item.");
  };

  const updateQuantity = async (item, delta) => {
    const variationId = item.variation_id || item.product_variation_id;
    const productId = item.product_id || item.product?.id;
    const newQuantity = item.quantity + delta;

    if (newQuantity <= 0) {
      await removeItem(item);
      return;
    }

    try {
      await addToCartAPI(productId, variationId, newQuantity);
      await loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log("UPDATE QTY ERROR:", err.message);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price ||
        item.active_price?.price ||
        item.variation?.price ||
        item.variation?.active_price?.price ||
        item.product?.price ||
        0;
      return total + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-xl text-gray-500 font-bold">Loading your cart...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans text-[#1a1a1a]">
      <div className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag size={32} className="text-[#E60023]" />
        Your Shopping Cart
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-5" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="inline-flex items-center gap-2.5 bg-[#111] text-white px-8 py-3 rounded-full font-semibold transition-colors hover:bg-[#333]">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
          <div className="flex flex-col gap-5">
            {cart.map((item) => (
              <CartItem 
                key={item.id || item.variation_id} 
                item={item} 
                updateQuantity={updateQuantity} 
                removeItem={removeItem} 
              />
            ))}
            <PaymentSelector paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          </div>

          <OrderSummary 
            cart={cart} 
            subtotal={subtotal} 
            shipping={shipping} 
            total={total} 
            paymentMethod={paymentMethod} 
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
