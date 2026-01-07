import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Link } from "wouter";

export default function Cart() {
    const { cart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useShop();

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
                            Shopping Cart
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-8 sm:mb-10 md:mb-12">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </motion.div>

                    {cart.length === 0 ? (
                        <div className="text-center py-12 sm:py-16 md:py-20">
                            <svg className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-gray-500 text-base sm:text-lg mb-4 sm:mb-6">Your cart is empty</p>
                            <Link href="/shop">
                                <button className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                                {cart.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.size}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 truncate">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">Size: {item.size}</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                                ${item.price}
                                            </p>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-lg"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 sm:px-6 py-2 border-x border-gray-200 min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-lg"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors text-sm sm:text-base font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:sticky lg:top-32">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6">
                                        Order Summary
                                    </h2>
                                    <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold">${getCartTotal()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-semibold">Free</span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-3 sm:pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-lg sm:text-xl font-bold">Total</span>
                                                <span className="text-lg sm:text-xl font-bold text-[#ff6a00]">
                                                    ${getCartTotal()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full px-5 sm:px-6 py-3 text-sm sm:text-base bg-[#ff6a00] text-white rounded-lg font-semibold hover:bg-[#ff7f33] transition-colors mb-3">
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full px-5 sm:px-6 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
