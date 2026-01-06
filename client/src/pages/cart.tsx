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
            
            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Shopping Cart
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mb-12">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </motion.div>

                    {cart.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                            <Link href="/shop">
                                <button className="px-6 py-3 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.size}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border border-gray-200 rounded-2xl p-6 flex gap-6"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">Size: {item.size}</p>
                                            <p className="text-2xl font-bold text-gray-900 mb-4">
                                                ${item.price}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-4 py-1 border-x border-gray-200">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
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
                                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-32">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Order Summary
                                    </h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold">${getCartTotal()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping</span>
                                            <span className="font-semibold">Free</span>
                                        </div>
                                        <div className="border-t border-gray-300 pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-xl font-bold">Total</span>
                                                <span className="text-xl font-bold text-[#ff6a00]">
                                                    ${getCartTotal()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full px-6 py-3 bg-[#ff6a00] text-white rounded-lg font-semibold hover:bg-[#ff7f33] transition-colors mb-3">
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
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
