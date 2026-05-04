import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersAPI } from "../../services/orderService";
import { Package, ChevronRight, ArrowLeft, Clock } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersAPI();
      console.log("ORDERS API FULL RESPONSE:", res.data);
      
      const ordersData =
        res.data?.data?.orders ||
        res.data?.data ||
        res.data?.orders ||
        res.data ||
        [];
      
      console.log("ORDERS ARRAY AFTER PARSE:", ordersData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.log("ORDER ERROR:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-gray-400">Loading Orders...</div>
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto py-12 px-5 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <button 
           onClick={() => navigate("/profile")}
           className="p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-gray-900">Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-center py-20 text-gray-500 font-bold">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id || order._id}
              onClick={() => navigate(`/order/${order.id || order._id}`)}
              className="group flex items-center gap-6 p-6 bg-white border border-gray-100 rounded-[2rem] transition-all hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#E60023] group-hover:bg-[#E60023] group-hover:text-white transition-all">
                <Package size={28} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                    <span className="text-sm font-black text-gray-900">#{order.id || order._id}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-orange-400" />
                        <span className="text-sm font-bold text-orange-500 capitalize">
                            {order.latest_status?.status || (Array.isArray(order.status) ? order.status[0]?.status : order.status) || "Processing"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                        <span className="text-xs font-bold">Total:</span>
                        <span className="text-sm font-black text-[#111]">₹{order.total_amount || order.grand_total}</span>
                    </div>
                </div>
              </div>

              <div className="text-right hidden md:block">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                 </p>
                 <p className="text-sm font-extrabold text-gray-900">{order.products?.length || 1} Items</p>
              </div>

              <ChevronRight className="text-gray-300 group-hover:text-[#E60023] transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
