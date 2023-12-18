import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { instance } from "@/utils/axios";
import moment from "moment";
import { OrderType, RootLineItems } from "@/common/types/orders";

export default function Orders() {
    const [orders, setOrders] = useState<OrderType[]>([]);

    useEffect(() => {
        instance.get("/orders").then((response) => {
            setOrders(response.data);
        });
    }, []);

    return (
        <Layout>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Recipient</th>
                        <th>Product</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 &&
                        orders.map((order: OrderType) => (
                            <tr key={order._id}>
                                <td>
                                    {moment(order.createdAt).format(
                                        "MMM DD YYYY LT"
                                    )}
                                </td>
                                <td
                                    className={
                                        order.paid
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }
                                >
                                    {order.paid ? "Paid" : "Unpaid"}
                                </td>
                                <td>
                                    {order.name} {order.email} <br />
                                    {order.city} {order.postalCode}{" "}
                                    {order.country} <br />
                                    {order.street}
                                </td>
                                <td>
                                    {order.line_items.map(
                                        (element: RootLineItems) => (
                                            <>
                                                {
                                                    element.price_data
                                                        .product_data?.name
                                                }{" "}
                                                x {element.quantity} <br />
                                            </>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout>
    );
}
