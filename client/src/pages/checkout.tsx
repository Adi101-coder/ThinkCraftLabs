import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Simple coupon definitions - percentage discounts
const COUPONS: Record<string, { discount: number; description: string }> = {
    "FIRST10": { discount: 10, description: "10% off for first-time customers" },
    "SAVE15": { discount: 15, description: "15% off your order" },
    "MEGA25": { discount: 25, description: "25% off your order" },
    "TEST10": { discount: 10, description: "10% off - Test coupon" },
};

export default function Checkout() {
    const [, setLocation] = useLocation();
    const { cart, getCartTotal, clearCart } = useShop();
    const { user } = useAuth();
    const { toast } = useToast();

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discount: number;
        description: string;
    } | null>(null);
    const [couponError, setCouponError] = useState("");

    const [formData, setFormData] = useState({
        shippingAddress: "",
        shippingCity: "",
        shippingState: "",
        shippingZip: "",
        shippingCountry: "USA",
        paymentMethod: "credit_card" as "credit_card" | "paypal" | "cash_on_delivery",
    });

    const createOrderMutation = useMutation({
        mutationFn: async (orderData: typeof formData) => {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...orderData,
                    couponCode: appliedCoupon?.code,
                    cartItems: cart,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Order creation failed");
            }

            return response.json();
        },
        onSuccess: (data) => {
            clearCart();
            toast({
                title: "Order placed successfully!",
                description: `Order #${data.order.orderNumber}`,
            });
            setLocation(`/order-confirmation/${data.order._id}`);
        },
        onError: (error: Error) => {
            toast({
                title: "Order failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    // Simple client-side coupon validation
    const handleApplyCoupon = () => {
        const code = couponCode.trim().toUpperCase();
        
        if (!code) {
            setCouponError("Please enter a coupon code");
            return;
        }

        const coupon = COUPONS[code];
        if (coupon) {
            const subtotal = parseFloat(getCartTotal());
            const discountAmount = (subtotal * coupon.discount) / 100;
            
            setAppliedCoupon({
                code,
                discount: discountAmount,
                description: coupon.description,
            });
            setCouponError("");
            toast({
                title: "Coupon applied!",
                description: `${coupon.discount}% off - You save $${discountAmount.toFixed(2)}`,
            });
        } else {
            setCouponError("Invalid coupon code");
            setAppliedCoupon(null);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
    };

    const subtotal = parseFloat(getCartTotal());
    const discount = appliedCoupon?.discount || 0;
    const total = subtotal - discount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: "Please login",
                description: "You need to be logged in to place an order",
                variant: "destructive",
            });
            setLocation("/login");
            return;
        }

        if (cart.length === 0) {
            toast({
                title: "Cart is empty",
                description: "Add items to your cart before checking out",
                variant: "destructive",
            });
            return;
        }

        createOrderMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />
                <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
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

    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            
            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Checkout
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-8">
                            Complete your order
                        </p>

                        {/* Special Offers Banner */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-[#ff6a00] to-[#ff7f33] rounded-2xl p-6 mb-8 text-white"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">Special Offers Available! 🎉</h3>
                                    <p className="text-white/90 mb-3">
                                        Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">FIRST10</span> for 10% off or <span className="font-bold bg-white/20 px-2 py-1 rounded">MEGA25</span> for 25% off!
                                    </p>
                                    <button
                                        onClick={() => {
                                            setCouponCode("FIRST10");
                                            const subtotal = parseFloat(getCartTotal());
                                            const discountAmount = (subtotal * 10) / 100;
                                            setAppliedCoupon({
                                                code: "FIRST10",
                                                discount: discountAmount,
                                                description: "10% off for first-time customers",
                                            });
                                            toast({
                                                title: "Coupon applied!",
                                                description: `10% off - You save $${discountAmount.toFixed(2)}`,
                                            });
                                        }}
                                        className="px-4 py-2 bg-white text-[#ff6a00] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
                                    >
                                        Apply 10% Off
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Shipping Information */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                name="shippingAddress"
                                                value={formData.shippingAddress}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                                                placeholder="123 Main St"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="shippingCity"
                                                    value={formData.shippingCity}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                                                    placeholder="New York"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    name="shippingState"
                                                    value={formData.shippingState}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                                                    placeholder="NY"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    name="shippingZip"
                                                    value={formData.shippingZip}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                                                    placeholder="10001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    name="shippingCountry"
                                                    value={formData.shippingCountry}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent"
                                                    placeholder="USA"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                                    <div className="space-y-3">
                                        {["credit_card", "paypal", "cash_on_delivery"].map((method) => (
                                            <label key={method} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#ff6a00] transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method}
                                                    checked={formData.paymentMethod === method}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 text-[#ff6a00]"
                                                />
                                                <span className="ml-3 text-gray-900 font-medium capitalize">
                                                    {method.replace(/_/g, " ")}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={createOrderMutation.isPending}
                                    className="w-full px-6 py-4 bg-[#ff6a00] text-white rounded-lg font-semibold text-lg hover:bg-[#ff7f33] transition-colors disabled:opacity-50"
                                >
                                    {createOrderMutation.isPending ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                                </button>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:sticky lg:top-32">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                
                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon Section */}
                                <div className="border-t border-gray-300 pt-4 mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Apply Coupon</h3>
                                    
                                    {/* Available Coupons */}
                                    {!appliedCoupon && (
                                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-xs text-blue-800 font-medium mb-2">💡 Available Coupons:</p>
                                            <div className="space-y-1 text-xs text-blue-700">
                                                <p>• <span className="font-bold">FIRST10</span> - 10% off</p>
                                                <p>• <span className="font-bold">SAVE15</span> - 15% off</p>
                                                <p>• <span className="font-bold">MEGA25</span> - 25% off</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {!appliedCoupon ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError("");
                                                    }}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    className="px-4 py-2 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors text-sm font-medium"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-red-500 text-xs">{couponError}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-green-800">{appliedCoupon.code}</span>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <p className="text-xs text-green-700">{appliedCoupon.description}</p>
                                            <p className="text-sm font-bold text-green-800 mt-1">
                                                -${appliedCoupon.discount.toFixed(2)} saved!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-gray-300 pt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({appliedCoupon?.code})</span>
                                            <span className="font-semibold">-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        <span className="font-semibold text-green-600">Free</span>
                                    </div>
                                    
                                    <div className="border-t border-gray-300 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-xl font-bold">Total</span>
                                            <span className="text-xl font-bold text-[#ff6a00]">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <p className="text-sm text-green-600 text-right mt-1">
                                                You're saving ${discount.toFixed(2)}! 🎉
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
