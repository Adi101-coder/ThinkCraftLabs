import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

export default function Cart() {
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
                            Review your items
                        </p>
                    </motion.div>

                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Your cart is empty</p>
                        <p className="text-gray-400 mt-2">Add some products to get started!</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
