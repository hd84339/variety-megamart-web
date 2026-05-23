import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Truck, ChevronRight } from "lucide-react";
import { orderCartProductAPI } from "../../services/orderService";
import { getCartAPI } from "../../services/cartService";
import { getAddressAPI, addAddressAPI } from "../../services/addressService";
import AddressSelection from "./components/AddressSelection";
import AddressForm from "./components/AddressForm";
import CheckoutSummary from "./components/CheckoutSummary";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentMethod = location.state?.paymentMethod || "COD";

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const emptyForm = {
    first_name: "", last_name: "", email: "", mobile: "", locality: "", address: "", postcode: "",
  };

  const [addressForm, setAddressForm] = useState(emptyForm);

  useEffect(() => {
    loadAddresses();
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCartAPI();
      let items = [];
      const d = res.data;
      if (Array.isArray(d)) items = d;
      else if (d?.data && Array.isArray(d.data)) items = d.data;
      else if (d?.cart && Array.isArray(d.cart)) items = d.cart;
      else if (d?.cart?.items && Array.isArray(d.cart.items)) items = d.cart.items;
      else if (d?.items && Array.isArray(d.items)) items = d.items;
      setCartItems(items);
    } catch (err) {
      console.error("LOAD CART ERROR:", err);
    }
  };

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const res = await getAddressAPI();
      const list = res.data.data || [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0]);
    } catch (err) {
      console.error("LOAD ADDRESS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    if (!addressForm.address || !addressForm.mobile) {
      toast.error("Please fill in the required fields.");
      return;
    }
    try {
      setLoading(true);
      await addAddressAPI(addressForm);
      toast.success("Address saved successfully!");
      setAddressForm(emptyForm); 
      await loadAddresses(); 
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data);
      toast.error("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    // Extract variation_ids from cart items
    const variationIds = cartItems.map(item => 
      item.variation_id || item.product_variation_id || item.id
    ).filter(Boolean);

    if (variationIds.length === 0) {
      toast.error("Your cart is empty. Please add items before placing an order.");
      return;
    }

    setOrderLoading(true);
    try {
      console.log("📦 Placing order with variation_ids:", variationIds);
      const res = await orderCartProductAPI(variationIds);
      console.log("✅ ORDER SUCCESS:", res.data);
      toast.success("Order placed successfully! 🎉");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/orders");
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.msg || err.message || "Please try again.";
      toast.error(`Order failed: ${errorMsg}`);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans bg-[#fcfcfc] min-h-screen">
      <div className="flex items-center gap-2 mb-8 text-sm text-gray-400">
        <span className="hover:text-[#E60023] cursor-pointer" onClick={() => navigate("/cart")}>Cart</span>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-bold">Checkout</span>
      </div>

      <h1 className="text-3xl font-black mb-10 flex items-center gap-3">
        <Truck className="text-[#E60023]" size={32} />
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-10">
          <AddressSelection 
            addresses={addresses} 
            selectedAddress={selectedAddress} 
            setSelectedAddress={setSelectedAddress} 
            setAddressForm={setAddressForm} 
            emptyForm={emptyForm} 
            loading={loading} 
          />
          <AddressForm 
            addressForm={addressForm} 
            handleFormChange={handleFormChange} 
            saveAddress={saveAddress} 
            loading={loading} 
          />
        </div>

        <CheckoutSummary 
          paymentMethod={paymentMethod} 
          selectedAddress={selectedAddress} 
          placeOrder={placeOrder} 
          orderLoading={orderLoading} 
        />
      </div>
    </div>
  );
};

export default Checkout;
