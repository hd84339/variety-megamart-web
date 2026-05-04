import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Truck, ChevronRight } from "lucide-react";
import { createOrderAPI } from "../../services/orderService";
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

  const emptyForm = {
    first_name: "", last_name: "", email: "", mobile: "", locality: "", address: "", postcode: "",
  };

  const [addressForm, setAddressForm] = useState(emptyForm);

  useEffect(() => {
    loadAddresses();
  }, []);

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
      alert("Please fill in the required fields.");
      return;
    }
    try {
      setLoading(true);
      await addAddressAPI(addressForm);
      alert("Address saved successfully!");
      setAddressForm(emptyForm); 
      await loadAddresses(); 
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data);
      alert("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setOrderLoading(true);
    try {
      const payload = {
        payment_method: paymentMethod.toLowerCase(),
        payment_status: paymentMethod === "ONLINE" ? "paid" : "pending",
        transaction_id: paymentMethod === "ONLINE" ? "online_" + Date.now() : "cod_order",
        first_name: selectedAddress.first_name,
        last_name: selectedAddress.last_name,
        email: selectedAddress.email,
        mobile: selectedAddress.mobile,
        address: selectedAddress.address,
        locality: selectedAddress.locality,
        postcode: selectedAddress.postcode,
      };
      const res = await createOrderAPI(payload);
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data);
      alert("Order failed. Please try again.");
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
