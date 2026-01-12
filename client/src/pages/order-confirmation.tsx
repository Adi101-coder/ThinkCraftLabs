import { useRoute, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Order, OrderItem } from "@shared/schema";

export default function OrderConfirmation() {
    const [, params] = useRoute("/order-confirmation/:orderId");
    const [, setLocation] = useLocation();
    const orderId = params?.orderId;

    const { data, isLoading, error } = useQuery({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const response = await fetch(`/api/orders/${orderId}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch order");
            }

            return response.json() as Promise<{ order: Order; items: OrderItem[] }>;
        },
        enabled: !!orderId,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />
                <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-gray-600">Loading order details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />
                <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order not found</h1>
                        <button
                            onClick={() => setLocation("/shop")}
                            className="px-6 py-3 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { order, items } = data;

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                            Order Confirmed!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            Thank you for your purchase
                        </p>
                        <p className="text-2xl font-bold text-[#ff6a00]">
                            Order #{order.orderNumber}
                        </p>
                    </motion.div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        {/* Order Items */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                ${(item.productPrice * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                                <div className="text-gray-600 space-y-1">
                                    <p>{order.shippingAddress}</p>
                                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                    <p>{order.shippingCountry}</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                                <p className="text-gray-600 capitalize">
                                    {order.paymentMethod.replace(/_/g, " ")}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-semibold text-gray-900 capitalize">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <>
                                            <div className="flex justify-between mb-2 text-green-600">
                                                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                                                <span className="font-semibold">-${order.discount.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold text-[#ff6a00]">
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    {order.discount > 0 && (
                                        <p className="text-sm text-green-600 text-right mt-2">
                                            You saved ${order.discount.toFixed(2)}! 🎉
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <button
                                onClick={() => setLocation("/profile")}
                                className="px-6 py-3 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors font-semibold"
                            >
                                View All Orders
                            </button>
                            <button
                                onClick={() => setLocation("/shop")}
                                className="px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-[#ff6a00] hover:text-[#ff6a00] transition-colors font-semibold"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
