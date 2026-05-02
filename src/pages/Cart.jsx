import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart, CreditCard, ShieldCheck } from "lucide-react";
import { getCartAPI, deleteCartAPI, addToCartAPI } from "../services/cartService";
import { createOrderAPI } from "../services/orderService";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCartAPI();
      console.log("CART RESPONSE:", res.data);

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
    console.log("Attempting to remove item:", item);

    const vId = item.variation_id || item.product_variation_id || item.id;
    const pId = item.product_id || item.product?.id;
    const cId = item.id;

    const idsToTry = [
      { product_id: pId, variation_id: vId },
      { variation_id: vId, product_id: pId },
      { cart_id: cId },
      { variation_id: vId },
      { id: cId }
    ];

    for (const payload of idsToTry) {
      if (payload.product_id === undefined && payload.variation_id === undefined && payload.cart_id === undefined) continue;

      try {
        console.log("Trying removal with combined payload:", payload);
        await deleteCartAPI(payload);
        await loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
        return;
      } catch (err) {
        console.log(`Removal failed for ${JSON.stringify(payload)}:`, err.message);
      }
    }

    alert("Failed to remove item. Please try refreshing the page.");
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
    // 🔥 SEND DELTA (+1 or -1) AS API IS ADDITIVE
    await addToCartAPI(productId, variationId, delta);

    await loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (err) {
    console.log("UPDATE QTY ERROR:", err.response?.data || err.message);
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
      <div className="max-w-[1200px] mx-auto p-10 text-center font-sans">
        <div className="animate-pulse text-xl text-gray-500">Loading your cart...</div>
      </div>
    );
  }

  const placeOrder = async () => {
    try {
      const orderPayload = {
        first_name: "John",
        last_name: "Doe",
        email: "customer@example.com",
        mobile: "9876543210",
        address: "Apartment 101, High Street",
        locality: "Andheri East", // Matches 'locality' requirement
        city: "Mumbai",
        state: "Maharashtra",
        postcode: "400001", // Matches 'postcode' requirement
        payment_method: "COD",
        items: cart.map((item) => ({
          product_id: item.product_id || item.product?.id,
          variation_id: item.variation_id || item.product_variation_id || item.id,
          quantity: item.quantity,
        })),
      };

      console.log("SENDING ORDER PAYLOAD:", orderPayload);
      const res = await createOrderAPI(orderPayload);
      
      console.log("ORDER RESPONSE:", res.data);
      alert("Order placed successfully!");
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    } catch (err) {
      console.log("ORDER ERROR FULL RESPONSE:", err.response?.data);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error || 
                       JSON.stringify(err.response?.data) ||
                       "Failed to place order. Please check all fields.";
      alert(errorMsg);
    }
  };

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
            {cart.map((item) => {
              const title = item.title ||
                item.name ||
                item.product?.title ||
                item.product?.name ||
                item.variation?.title ||
                "Product";

              const rawImage = item.image ||
                item.latest_image?.image ||
                item.product?.image ||
                item.product?.latest_image?.image ||
                item.variation?.image ||
                item.variation?.latest_image?.image;

              const imageUrl = rawImage
                ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
                : PLACEHOLDER_IMAGE;

              const price = item.price ||
                item.active_price?.price ||
                item.variation?.price ||
                item.variation?.active_price?.price ||
                item.product?.price ||
                0;

              const mrp = item.mrp ||
                item.active_price?.mrp ||
                item.variation?.mrp ||
                item.variation?.active_price?.mrp ||
                item.product?.mrp ||
                price;

              return (
                <div key={item.id || item.variation_id} className="flex bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-[120px] h-[120px] object-cover rounded-xl bg-gray-50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="flex-1 ml-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold mb-1 leading-tight">{title}</h4>
                        <div className="text-[0.85rem] text-gray-500">
                          {item.variant_name || item.variation?.name || "Standard Edition"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#E60023]">₹{price}</div>
                        {mrp > price && (
                          <div className="text-[0.8rem] text-gray-400 line-through">
                            ₹{mrp}
                          </div>
                        )}
                        <div className="text-[0.85rem] font-bold text-gray-900 mt-1">
                          Total: ₹{price * item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          className="w-7 h-7 bg-white rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 border-none shadow-sm"
                          onClick={() => updateQuantity(item, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 font-semibold min-w-[30px] text-center">{item.quantity}</span>
                        <button
                          className="w-7 h-7 bg-white rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-200 border-none shadow-sm"
                          onClick={() => updateQuantity(item, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item);
                        }}
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-[100px]">
            <h3 className="text-xl font-bold mb-5 pb-4 border-b border-gray-100">Order Summary</h3>

            <div className="flex justify-between mb-3 text-gray-500 text-[0.95rem]">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-3 text-gray-500 text-[0.95rem]">
              <span>Shipping Fee</span>
              <span className={shipping === 0 ? "text-green-500 font-bold" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            {shipping !== 0 && (
              <div className="text-[0.75rem] text-[#E60023] mb-3">
                Add ₹{500 - subtotal} more for FREE shipping!
              </div>
            )}

            <div className="flex justify-between mt-5 pt-5 border-t-2 border-dashed border-gray-100 text-[#111] font-extrabold text-xl">
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>


            <button className="w-full bg-[#E60023] text-white py-4 rounded-xl font-semibold text-lg mt-6 transition-all hover:bg-[#cc001f] active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer"
              onClick={placeOrder}
            >
              <CreditCard size={20} />
              Place Order
            </button>

            <div className="mt-5 flex items-center gap-2 text-[0.8rem] text-gray-500">
              <ShieldCheck size={16} className="text-green-500" />
              Secure Checkout & 7-day Returns
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
