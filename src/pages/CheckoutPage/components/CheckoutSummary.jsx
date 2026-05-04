import React from "react";
import { CreditCard, MapPin, ChevronRight, Loader2 } from "lucide-react";

const CheckoutSummary = ({ paymentMethod, selectedAddress, placeOrder, orderLoading }) => {
  return (
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
          className="w-full bg-[#E60023] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all hover:bg-[#cc001f] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none border-none cursor-pointer"
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
  );
};

export default CheckoutSummary;
