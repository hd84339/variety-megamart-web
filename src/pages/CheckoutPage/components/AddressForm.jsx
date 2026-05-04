import React from "react";
import { Plus } from "lucide-react";

const AddressForm = ({ addressForm, handleFormChange, saveAddress, loading }) => {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mt-10">
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
              value={addressForm[field.name]}
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
            value={addressForm.address}
            placeholder="House No, Building, Street..." 
            onChange={handleFormChange} 
            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-red-100 outline-none resize-none font-medium" 
          />
        </div>
      </div>

      <button 
        onClick={saveAddress}
        disabled={loading}
        className="mt-6 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 border-none cursor-pointer"
      >
        Save Address
      </button>
    </section>
  );
};

export default AddressForm;
