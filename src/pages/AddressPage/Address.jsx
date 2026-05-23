import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Plus, ArrowLeft, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAddressAPI, addAddressAPI, deleteAddressAPI, editAddressAPI } from "../../services/addressService";
import AddressForm from "../CheckoutPage/components/AddressForm";

const Address = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

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
      setAddresses(res.data.data || []);
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
      if (editingId) {
        await editAddressAPI({ ...addressForm, address_id: editingId });
        toast.success("Address updated successfully!");
      } else {
        await addAddressAPI(addressForm);
        toast.success("Address saved successfully!");
      }
      setAddressForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
      await loadAddresses();
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data);
      toast.error("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setAddressForm({
      first_name: addr.first_name || "",
      last_name: addr.last_name || "",
      email: addr.email || "",
      mobile: addr.mobile || "",
      locality: addr.locality || "",
      address: addr.address || "",
      postcode: addr.postcode || "",
    });
    setEditingId(addr.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    console.log("🗑️ DELETING ADDRESS WITH ID:", id);
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setLoading(true);
      await deleteAddressAPI(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      toast.error("Failed to delete address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-5 min-h-screen font-sans">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-900 border border-gray-100 hover:bg-[#E60023] hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight uppercase">Saved Addresses</h1>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#E60023] text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-red-100 border-none cursor-pointer active:scale-95"
          >
            <Plus size={20} />
            {editingId ? "Edit Address" : "Add New"}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
           <AddressForm 
             addressForm={addressForm} 
             handleFormChange={handleFormChange} 
             saveAddress={saveAddress} 
             loading={loading} 
           />
           <button 
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setAddressForm(emptyForm);
            }}
            className="mt-4 text-gray-400 font-bold hover:text-[#E60023] transition-colors border-none bg-transparent cursor-pointer ml-8"
           >
             Cancel
           </button>
        </div>
      )}

      {loading && !addresses.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
           <MapPin size={64} className="text-gray-100 mb-6" />
           <h2 className="text-2xl font-bold text-gray-400">No saved addresses found</h2>
           <p className="text-gray-400 mt-2">Add your first address to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#E60023] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-red-50 text-[#E60023] rounded-2xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(addr)}
                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border-none cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="w-10 h-10 bg-red-50 text-[#E60023] rounded-xl flex items-center justify-center hover:bg-[#E60023] hover:text-white transition-all border-none cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                {addr.first_name} {addr.last_name}
              </h3>
              
              <div className="space-y-1">
                <p className="text-gray-600 font-medium leading-relaxed">{addr.address}</p>
                <p className="text-gray-600 font-medium">{addr.locality}, {addr.postcode}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Phone Number</span>
                  <span className="text-sm font-bold text-gray-700">{addr.mobile}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Address;
