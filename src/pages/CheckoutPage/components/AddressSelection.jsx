import React from "react";
import { CheckCircle2, Phone } from "lucide-react";

const AddressSelection = ({ addresses, selectedAddress, setSelectedAddress, setAddressForm, emptyForm, loading }) => {
  return (
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
                  setAddressForm(emptyForm);
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
  );
};

export default AddressSelection;
