import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";
import { Link } from "wouter";

export default function Wishlist() {
    const { wishlist, removeFromWishlist, addToCart } = useShop();

    const handleMoveToCart = (product: any) => {
        addToCart(product, "Medium");
        removeFromWishlist(product.id);
    };

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
                            Wishlist
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mb-12">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                        </p>
                    </motion.div>

                    {wishlist.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">Your wishlist is empty</p>
                            <Link href="/shop">
                                <button className="px-6 py-3 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {wishlist.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {product.desc}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-4">
                                            ${product.price}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleMoveToCart(product)}
                                                className="flex-1 px-4 py-2 bg-[#ff6a00] text-white rounded-lg hover:bg-[#ff7f33] transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
