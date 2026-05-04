import React from "react";
import { CreditCard, Banknote, CheckCircle2 } from "lucide-react";

const PaymentSelector = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mt-8">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <CreditCard className="text-[#E60023]" size={24} />
        Select Payment Method
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cash on Delivery Option */}
        <div 
          onClick={() => setPaymentMethod("COD")}
          className={`group relative flex items-center gap-5 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
            paymentMethod === "COD" 
            ? "border-[#E60023] bg-red-50/30 ring-4 ring-red-50" 
            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
          }`}
        >
          <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === "COD" ? "bg-[#E60023] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
            <Banknote size={28} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-gray-900 text-lg">Cash on Delivery</div>
            <div className="text-sm text-gray-500 font-medium mt-0.5">Pay when you receive</div>
          </div>
          {paymentMethod === "COD" && <CheckCircle2 className="text-[#E60023] animate-in zoom-in duration-300" size={24} />}
        </div>

        {/* Online Payment Option */}
        <div 
          onClick={() => setPaymentMethod("ONLINE")}
          className={`group relative flex items-center gap-5 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${
            paymentMethod === "ONLINE" 
            ? "border-[#E60023] bg-red-50/30 ring-4 ring-red-50" 
            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
          }`}
        >
          <div className={`p-4 rounded-2xl transition-colors ${paymentMethod === "ONLINE" ? "bg-[#E60023] text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
            <CreditCard size={28} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-gray-900 text-lg">Online Payment</div>
            <div className="text-sm text-gray-500 font-medium mt-0.5">Cards, UPI, or NetBanking</div>
          </div>
          {paymentMethod === "ONLINE" && <CheckCircle2 className="text-[#E60023] animate-in zoom-in duration-300" size={24} />}
        </div>
      </div>
    </div>
  );
};

export default PaymentSelector;
