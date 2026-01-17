import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@shared/schema";

export default function Profile() {
    const { user, isAuthenticated, logout } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            setLocation("/login");
        }
    }, [isAuthenticated, setLocation]);

    const { data: ordersData } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await fetch("/api/orders", {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            return response.json() as Promise<{ orders: Order[] }>;
        },
        enabled: isAuthenticated,
    });

    const handleLogout = () => {
        logout();
        setLocation("/");
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            
            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            My Profile
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mb-12">
                            Welcome back, {user.username}!
                        </p>
                    </motion.div>

                    {/* Profile Content */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-1"
                        >
                            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#ff6a00] to-[#ff7f33] rounded-full flex items-center justify-center mb-4">
                                        <span className="text-3xl font-bold text-white">
                                            {user.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.username}</h2>
                                    <p className="text-gray-500 text-sm mb-4">{user.email}</p>
                                    
                                    {user.isAdmin && (
                                        <Link href="/admin">
                                            <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-2 flex items-center justify-center gap-2 font-medium">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                Admin Dashboard
                                            </button>
                                        </Link>
                                    )}
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors mb-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="md:col-span-2"
                        >
                            <div className="grid sm:grid-cols-2 gap-6">
                                <Link href="/wishlist">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                                <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Wishlist</h3>
                                        <p className="text-gray-600 text-sm">View your saved items</p>
                                    </div>
                                </Link>

                                <Link href="/cart">
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                                <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopping Cart</h3>
                                        <p className="text-gray-600 text-sm">Review your cart items</p>
                                    </div>
                                </Link>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                            <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                                    <p className="text-gray-600 text-sm">{ordersData?.orders.length || 0} total orders</p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                            <svg className="w-6 h-6 text-gray-700 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                                    <p className="text-gray-600 text-sm">Manage preferences</p>
                                </div>
                            </div>

                            {/* Order History */}
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
                                {ordersData && ordersData.orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {ordersData.orders.map((order) => (
                                            <Link key={order._id || order.id} href={`/order-confirmation/${order._id || order.id}`}>
                                                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 mb-1">
                                                                Order #{order.orderNumber}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-600 mb-1">Total</p>
                                                                <p className="font-bold text-[#ff6a00]">
                                                                    ${order.totalAmount.toFixed(2)}
                                                                </p>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-500 mb-4">No orders yet</p>
                                        <Link href="/shop">
                                            <button className="px-6 py-2 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors">
                                                Start Shopping
                                            </button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
