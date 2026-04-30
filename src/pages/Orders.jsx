import React, { useEffect, useState } from "react";
import { getOrdersAPI } from "../services/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getOrdersAPI();

            console.log("ORDERS:", res.data);

            setOrders(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>My Orders</h2>

            {orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} style={{ marginBottom: "10px" }}>
                        <h4>Order #{order.id}</h4>
                        <p>Status: {order.status}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;