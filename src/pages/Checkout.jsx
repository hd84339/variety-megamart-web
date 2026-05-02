import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ChevronRight,
  Loader2,
  Phone
} from "lucide-react";
import { createOrderAPI } from "../services/orderService";
import { getAddressAPI, addAddressAPI } from "../services/addressService";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentMethod = location.state?.paymentMethod || "COD";

  // States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  // Initial Empty Form State
  const emptyForm = {
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    locality: "",
    address: "",
    postcode: "",
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
      // Auto-select first address if list isn't empty
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

  // Logic to save address and clear the form
  const saveAddress = async () => {
    if (!addressForm.address || !addressForm.mobile) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      setLoading(true);
      await addAddressAPI(addressForm);
      alert("Address saved successfully!");
      
      // 1. Clear the inputs
      setAddressForm(emptyForm); 
      
      // 2. Refresh the list
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
      console.log("FINAL ORDER PAYLOAD:", payload);
      console.log("ORDER SUCCESS:", res.data);

      alert("Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data);
      alert("Order failed. Please try again.", err);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans bg-[#fcfcfc] min-h-screen">
      {/* Breadcrumbs */}
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
        
        {/* LEFT COLUMN */}
        <div className="space-y-10">
          
          {/* 1. Address Selection */}
          <section>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              1. Delivery Address
            </h2>
            
            {loading ? (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[1, 2].map(i => <div key={i} className="min-w-[280px] h-32 bg-gray-100 animate-pulse rounded-3xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => {
                        setSelectedAddress(addr);
                        setAddressForm(emptyForm); // Clear form when selecting saved addr
                    }}
                    className={`relative p-5 rounded-[2rem] border-2 transition-all cursor-pointer bg-white ${
                      selectedAddress?.id === addr.id 
                      ? "border-[#E60023] bg-red-50/30" 
                      : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="font-bold text-lg">{addr.first_name} {addr.last_name}</div>
                    <p className="text-sm text-gray-500 mt-1">{addr.address}, {addr.locality}</p>
                    <div className="mt-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Phone size={14} /> {addr.mobile}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 2. Add New Address Form */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={22} className="text-[#E60023]" />
              Add New Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "First Name", name: "first_name", placeholder: "John" },
                { label: "Last Name", name: "last_name", placeholder: "Doe" },
                { label: "Email", name: "email", placeholder: "john@example.com", colSpan: true },
                { label: "Mobile", name: "mobile", placeholder: "9876543210" },
                { label: "Pincode", name: "postcode", placeholder: "400001" },
                { label: "Locality", name: "locality", placeholder: "Landmark/Area", colSpan: true },
              ].map((field) => (
                <div key={field.name} className={`space-y-1 ${field.colSpan ? "md:col-span-2" : ""}`}>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">{field.label}</label>
                  <input 
                    name={field.name}
                    value={addressForm[field.name]} // Controlled Input
                    placeholder={field.placeholder}
                    onChange={handleFormChange}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-100 outline-none font-medium"
                  />
                </div>
              ))}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Address</label>
                <textarea 
                  name="address" 
                  rows="3" 
                  value={addressForm.address} // Controlled Input
                  placeholder="House No, Building, Street..." 
                  onChange={handleFormChange} 
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-100 outline-none resize-none font-medium" 
                />
              </div>
            </div>

            <button 
              onClick={saveAddress}
              disabled={loading}
              className="mt-6 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
            >
              Save Address
            </button>
          </section>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <aside className="lg:sticky lg:top-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl text-[#E60023]"><CreditCard size={20}/></div>
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase">Payment</div>
                  <div className="text-sm font-bold text-gray-900">{paymentMethod}</div>
                </div>
              </div>

              {selectedAddress && (
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600 mt-1"><MapPin size={20}/></div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase">Deliver To</div>
                    <div className="text-sm font-bold text-gray-900 line-clamp-2">
                      {selectedAddress.first_name}, {selectedAddress.address}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={placeOrder}
              disabled={orderLoading || !selectedAddress}
              className="w-full bg-[#E60023] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all hover:bg-[#cc001f] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {orderLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Place Order <ChevronRight size={20} /></>
              )}
            </button>
            
            <p className="mt-5 text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
              Standard 3-5 Days Delivery
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;