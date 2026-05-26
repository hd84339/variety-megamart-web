import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderReceipt } from "../../services/orderService";
import { ArrowLeft, MapPin, CreditCard, Calendar, Package } from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderReceipt(id);
      const responseData = res.data;
      console.log("ORDER RECEIPT FULL RESPONSE:", responseData);
      
      let orderData = responseData?.data || responseData?.result || responseData?.order || responseData;
      
      // If the direct receipt endpoint fails with 401, try finding it in the user's order list!
      if (responseData?.response === false || responseData?.msg === "Unauthorised Access" || responseData?.[0] === 401) {
        console.warn("Direct receipt API returned 401. Falling back to getUserOrder list...");
        
        // Import getOrdersAPI at the top if not already (it's in orderService, let's assume it's imported or we can just fetch it)
        const { getOrdersAPI } = await import("../../services/orderService");
        const listRes = await getOrdersAPI();
        const listData = listRes.data?.data?.orders || listRes.data?.data || listRes.data?.orders || listRes.data || [];
        
        const foundOrder = (Array.isArray(listData) ? listData : []).find(
            (o) => String(o.id || o._id) === String(id)
        );

        if (!foundOrder) {
            console.error("Order not found in user's order list either.");
            setOrder(null);
            return;
        }
        orderData = foundOrder;
      }

      if (Array.isArray(orderData) && orderData.length > 0) {
        orderData = orderData[0];
      }

      // Fetch variation details to resolve price and image on frontend
      if (orderData) {
        const items = orderData.products || orderData.items || orderData.order_items || orderData.orderDetails || [];
        const { default: API } = await import("../../services/api");
        await Promise.all(
          items.map(async (item) => {
            const varId = item.variation_id || item.product_variation_id || item.variation?.id;
            if (varId) {
              try {
                const varRes = await API.get(`/getVariationDetail/${varId}`);
                if (varRes.data?.data) {
                  item.resolvedVariation = varRes.data.data;
                }
              } catch (e) {
                console.error("Failed to load variation details for variation_id", varId, e);
              }
            }
          })
        );
      }

      setOrder(orderData);
    } catch (err) {
      console.error("ORDER DETAIL ERROR:", err);

    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold text-gray-400">Fetching Order Details...</div>
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
        <button onClick={() => navigate("/orders")} className="mt-4 text-[#E60023] font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button 
           onClick={() => navigate("/orders")}
           className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h1>
            <p className="text-gray-500 font-medium">Tracking number: #{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Info & Items */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Status Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Current Status</p>
                        <p className="text-lg font-black text-gray-900 capitalize">
                            {order.latest_status?.status || (Array.isArray(order.status) ? order.status[0]?.status : order.status) || "Confirmed"}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Date</p>
                    <div className="flex items-center gap-2 font-bold text-gray-700 mt-1">
                        <Calendar size={14} />
                        {new Date(order.created_at || order.createdAt || order.date || Date.now()).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Order Content</h3>
                <div className="space-y-6">
                    {(order.products || order.items || order.order_items || order.orderDetails || []).map((item, idx) => {
                        const targetVariationId = item.variation_id || item.product_variation_id || item.variation?.id || item.product_id || item.id;

                        const title = item.title ||
                            item.name ||
                            item.product?.title ||
                            item.product?.name ||
                            item.variation?.title ||
                            item.variation?.product?.title ||
                            item.resolvedVariation?.title ||
                            item.resolvedVariation?.product?.title ||
                            `Product #${item.product_id || targetVariationId}`;

                        const rawImage = item.image ||
                            item.latest_image?.image ||
                            item.product?.image ||
                            item.product?.latest_image?.image ||
                            item.variation?.image ||
                            item.variation?.latest_image?.image ||
                            item.variation?.product?.latest_image?.image ||
                            item.resolvedVariation?.image ||
                            item.resolvedVariation?.latest_image?.image ||
                            item.resolvedVariation?.product?.latest_image?.image;

                        const imageUrl = rawImage
                            ? (rawImage.startsWith('http') ? rawImage : `https://project.varietymegastore.com/uploads/variations/${rawImage}`)
                            : "https://via.placeholder.com/150";

                        const price = item.price ||
                            item.total_price ||
                            item.amount ||
                            item.resolvedVariation?.active_price?.price ||
                            item.resolvedVariation?.price ||
                            item.active_price?.price ||
                            item.variation?.price ||
                            item.variation?.active_price?.price ||
                            item.product?.price ||
                            0;

                        return (
                            <div 
                                key={idx} 
                                className="flex items-center gap-5 p-4 bg-gray-50 rounded-[2rem] border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors group"
                                onClick={() => {
                                    if (targetVariationId) {
                                        navigate(`/product/${targetVariationId}`);
                                    }
                                }}
                            >
                                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                                    <img 
                                        src={imageUrl} 
                                        alt={title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-[#E60023] transition-colors">
                                        {title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs font-bold text-gray-400">Qty: {item.quantity || 1}</span>
                                        <span className="text-sm font-black text-[#E60023]">₹{price}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Right Column: Billing & Shipping */}
        <div className="space-y-8">
            {/* Payment Method */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-[#E60023]" />
                    Payment
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-bold text-gray-800">Method</p>
                    <p className="text-sm text-gray-500 uppercase font-black tracking-widest mt-1">
                        {order.payment_method || order.paymentType || order.payment_type || "COD"}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</p>
                         <p className="text-sm font-black text-green-600 uppercase mt-1">
                            {order.payment_status || ((order.paymentType || order.payment_method) === 'COD' ? 'Pending' : 'Paid')}
                         </p>
                    </div>
                </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-[#E60023]" />
                    Shipping
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-bold text-gray-800">{order.first_name} {order.last_name}</p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        {order.address}, {order.locality}<br/>
                        {order.postcode}
                    </p>
                    {order.mobile && (
                        <p className="text-xs font-bold text-gray-400 mt-3">Phone: {order.mobile}</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
