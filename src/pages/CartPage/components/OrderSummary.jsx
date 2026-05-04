import React from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ cart, subtotal, shipping, total, paymentMethod }) => {
  const navigate = useNavigate();

  return (
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
        onClick={() => navigate("/checkout", { state: { paymentMethod } })}
      >
        <CreditCard size={20} />
        Proceed to Checkout
      </button>

      <div className="mt-5 flex items-center gap-2 text-[0.8rem] text-gray-500">
        <ShieldCheck size={16} className="text-green-500" />
        Secure Checkout & 7-day Returns
      </div>
    </div>
  );
};

export default OrderSummary;
