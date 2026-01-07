import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/contexts/ShopContext";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    desc: string;
    category: string;
}

export default function Shop() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("Medium");
    const [modalPosition, setModalPosition] = useState({ top: 0 });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("All Products");
    const { addToCart, addToWishlist, isInWishlist } = useShop();

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddToCart = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, selectedSize);
            setSelectedProduct(null);
            showNotification(`${selectedProduct.name} added to cart!`);
        }
    };

    const handleAddToWishlist = () => {
        if (selectedProduct) {
            if (isInWishlist(selectedProduct.id)) {
                showNotification('Already in wishlist', 'error');
            } else {
                addToWishlist(selectedProduct);
                showNotification(`${selectedProduct.name} added to wishlist!`);
            }
        }
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProduct]);

    // Close modal on ESC key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProduct) {
                setSelectedProduct(null);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [selectedProduct]);

    const handleProductClick = (product: Product, event: React.MouseEvent) => {
        setSelectedProduct(product);
        // Calculate position to show modal in current viewport
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;
        const clickY = event.clientY;

        // Position modal to be visible in current viewport
        setModalPosition({ top: scrollY + Math.max(50, clickY - 300) });
    };

    const products: Product[] = [
        { id: 1, name: "3D Printed Model 1", price: "179.00", image: "/Shopping_images/42.jpg", desc: "Lighting fixture component", category: "3D Printing" },
        { id: 2, name: "3D Printed Model 2", price: "99.00", image: "/Shopping_images/15.jpg", desc: "Medical device prototype for testing", category: "Prototyping" },
        { id: 3, name: "3D Printed Model 3", price: "225.00", image: "/Shopping_images/7.png", desc: "Complex geometry design with smooth surface finish", category: "Design Services" },
        { id: 4, name: "3D Printed Model 4", price: "135.00", image: "/Shopping_images/28.jpg", desc: "Professional-grade prototype model", category: "Prototyping" },
        { id: 5, name: "3D Printed Model 5", price: "89.00", image: "/Shopping_images/51.jpg", desc: "Mechanical gear assembly", category: "3D Printing" },
        { id: 6, name: "3D Printed Model 6", price: "199.00", image: "/Shopping_images/3.jpg", desc: "Advanced functional prototype with detailed finishing", category: "Prototyping" },
        { id: 7, name: "3D Printed Model 7", price: "145.00", image: "/Shopping_images/36.jpg", desc: "Office organizer with modular design", category: "Design Services" },
        { id: 8, name: "3D Printed Model 8", price: "119.00", image: "/Shopping_images/19.jpg", desc: "Mechanical assembly component", category: "3D Printing" },
        { id: 9, name: "3D Printed Model 9", price: "169.00", image: "/Shopping_images/8.png", desc: "Multi-material composite 3D printed part", category: "3D Printing" },
        { id: 10, name: "3D Printed Model 10", price: "95.00", image: "/Shopping_images/44.jpg", desc: "Toy component for educational kits", category: "Design Services" },
        { id: 11, name: "3D Printed Model 11", price: "209.00", image: "/Shopping_images/11.jpg", desc: "Industrial-grade functional prototype", category: "Prototyping" },
        { id: 12, name: "3D Printed Model 12", price: "129.00", image: "/Shopping_images/24.jpg", desc: "Custom jig for manufacturing", category: "3D Printing" },
        { id: 13, name: "3D Printed Model 13", price: "159.00", image: "/Shopping_images/47.jpg", desc: "Art installation piece", category: "Design Services" },
        { id: 14, name: "3D Printed Model 14", price: "79.00", image: "/Shopping_images/5.jpg", desc: "Precision-crafted model for testing and validation", category: "Prototyping" },
        { id: 15, name: "3D Printed Model 15", price: "189.00", image: "/Shopping_images/33.jpg", desc: "Sports equipment component", category: "3D Printing" },
        { id: 16, name: "3D Printed Model 16", price: "109.00", image: "/Shopping_images/16.jpg", desc: "Automotive part replacement solution", category: "Prototyping" },
        { id: 17, name: "3D Printed Model 17", price: "215.00", image: "/Shopping_images/50.jpg", desc: "Architectural detail element", category: "Design Services" },
        { id: 18, name: "3D Printed Model 18", price: "99.00", image: "/Shopping_images/1.jpg", desc: "High-quality 3D printed product with precision engineering", category: "3D Printing" },
        { id: 19, name: "3D Printed Model 19", price: "175.00", image: "/Shopping_images/26.jpg", desc: "Drone component with lightweight design", category: "Prototyping" },
        { id: 20, name: "3D Printed Model 20", price: "125.00", image: "/Shopping_images/39.jpg", desc: "Musical instrument part", category: "Design Services" },
        { id: 21, name: "3D Printed Model 21", price: "149.00", image: "/Shopping_images/2.jpg", desc: "Custom designed prototype for industrial applications", category: "Prototyping" },
        { id: 22, name: "3D Printed Model 22", price: "185.00", image: "/Shopping_images/48.jpg", desc: "Scientific equipment component", category: "3D Printing" },
        { id: 23, name: "3D Printed Model 23", price: "92.00", image: "/Shopping_images/12.jpg", desc: "Educational model for STEM learning", category: "Design Services" },
        { id: 24, name: "3D Printed Model 24", price: "139.00", image: "/Shopping_images/37.jpg", desc: "Pet accessory with durable material", category: "3D Printing" },
        { id: 25, name: "3D Printed Model 25", price: "205.00", image: "/Shopping_images/20.jpg", desc: "Premium quality display model", category: "Design Services" },
        { id: 26, name: "3D Printed Model 26", price: "115.00", image: "/Shopping_images/45.jpg", desc: "Bicycle accessory with custom fit", category: "3D Printing" },
        { id: 27, name: "3D Printed Model 27", price: "169.00", image: "/Shopping_images/10.jpg", desc: "High-resolution miniature with intricate details", category: "3D Printing" },
        { id: 28, name: "3D Printed Model 28", price: "99.00", image: "/Shopping_images/34.jpg", desc: "Kitchen gadget with practical design", category: "Design Services" },
        { id: 29, name: "3D Printed Model 29", price: "155.00", image: "/Shopping_images/23.jpg", desc: "Engineering test fixture", category: "Prototyping" },
        { id: 30, name: "3D Printed Model 30", price: "89.00", image: "/Shopping_images/6.png", desc: "Affordable rapid prototyping solution", category: "Prototyping" },
        { id: 31, name: "3D Printed Model 31", price: "195.00", image: "/Shopping_images/43.jpg", desc: "Furniture connector with strong build", category: "3D Printing" },
        { id: 32, name: "3D Printed Model 32", price: "129.00", image: "/Shopping_images/17.jpg", desc: "Consumer product prototype with ergonomic design", category: "Prototyping" },
        { id: 33, name: "3D Printed Model 33", price: "179.00", image: "/Shopping_images/30.jpg", desc: "Electronics enclosure with ventilation", category: "Design Services" },
        { id: 34, name: "3D Printed Model 34", price: "105.00", image: "/Shopping_images/52.jpg", desc: "Custom badge with logo design", category: "Design Services" },
        { id: 35, name: "3D Printed Model 35", price: "149.00", image: "/Shopping_images/9.jpg", desc: "Lightweight structural component for aerospace", category: "Prototyping" },
        { id: 36, name: "3D Printed Model 36", price: "219.00", image: "/Shopping_images/35.jpg", desc: "Collectible figurine with high detail", category: "3D Printing" },
        { id: 37, name: "3D Printed Model 37", price: "85.00", image: "/Shopping_images/14.jpg", desc: "Customizable design for personal projects", category: "Design Services" },
        { id: 38, name: "3D Printed Model 38", price: "165.00", image: "/Shopping_images/41.jpg", desc: "Camera mount for photography", category: "3D Printing" },
        { id: 39, name: "3D Printed Model 39", price: "139.00", image: "/Shopping_images/4.jpg", desc: "Durable engineering-grade 3D printed component", category: "3D Printing" },
        { id: 40, name: "3D Printed Model 40", price: "199.00", image: "/Shopping_images/27.jpg", desc: "Robotics part for DIY projects", category: "Prototyping" },
        { id: 41, name: "3D Printed Model 41", price: "109.00", image: "/Shopping_images/49.jpg", desc: "Cosplay prop with detailed finish", category: "Design Services" },
        { id: 42, name: "3D Printed Model 42", price: "175.00", image: "/Shopping_images/18.jpg", desc: "Artistic sculpture with complex curves", category: "Design Services" },
        { id: 43, name: "3D Printed Model 43", price: "95.00", image: "/Shopping_images/31.jpg", desc: "Jewelry piece with intricate patterns", category: "Design Services" },
        { id: 44, name: "3D Printed Model 44", price: "189.00", image: "/Shopping_images/22.jpg", desc: "Decorative item with smooth finish", category: "3D Printing" },
        { id: 45, name: "3D Printed Model 45", price: "125.00", image: "/Shopping_images/46.jpg", desc: "Wearable tech housing", category: "3D Printing" },
        { id: 46, name: "3D Printed Model 46", price: "159.00", image: "/Shopping_images/13.jpg", desc: "Architectural scale model with fine details", category: "Design Services" },
        { id: 47, name: "3D Printed Model 47", price: "135.00", image: "/Shopping_images/38.jpg", desc: "Garden tool with ergonomic grip", category: "3D Printing" },
        { id: 48, name: "3D Printed Model 48", price: "209.00", image: "/Shopping_images/21.jpg", desc: "Functional tool for workshop use", category: "Prototyping" },
        { id: 49, name: "3D Printed Model 49", price: "119.00", image: "/Shopping_images/32.jpg", desc: "Fashion accessory with modern design", category: "Design Services" },
        { id: 50, name: "3D Printed Model 50", price: "145.00", image: "/Shopping_images/25.jpg", desc: "Replacement part for home appliances", category: "3D Printing" },
        { id: 51, name: "3D Printed Model 51", price: "169.00", image: "/Shopping_images/40.jpg", desc: "Phone stand with adjustable angle", category: "Design Services" },
    ];

    const categories = ["All Products", "3D Printing", "Design Services", "Prototyping"];

    const filteredProducts = selectedCategory === "All Products" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    const sizes = ["Small", "Medium", "Large", "X-Large"];

    const getSuggestedProducts = (currentId: number) => {
        return products.filter(p => p.id !== currentId).slice(0, 3);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-24 right-4 z-[100] px-6 py-4 rounded-lg shadow-lg ${
                            notification.type === 'success' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {notification.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className="font-medium">{notification.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Shopping Content */}
            <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Shop
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Discover our curated collection of innovative products and services
                        </p>
                    </motion.div>

                    {/* Filters Section */}
                    <motion.div
                        className="mb-8 flex flex-wrap gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#ff6a00] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </motion.div>

                    {/* Products Grid */}
                    <motion.div
                        key={selectedCategory}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.01
                                }
                            }
                        }}
                    >
                        {/* Product Cards */}
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
                                }}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => handleProductClick(product, e)}
                                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#ff6a00] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </main>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
                            style={{ top: `${modalPosition.top}px` }}
                            className="fixed left-0 right-0 z-[60] px-4 mx-auto w-full max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[85vh] overflow-hidden flex flex-col mx-auto">
                                {/* Scrollable Content */}
                                <div className="overflow-y-auto flex-1 scrollbar-hide">
                                    <div className="p-6 md:p-8">
                                        {/* Product Details Section */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            {/* Product Image */}
                                            <div className="rounded-xl overflow-hidden bg-gray-100">
                                                <img
                                                    src={selectedProduct.image}
                                                    alt={selectedProduct.name}
                                                    className="w-full h-full object-cover aspect-square"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex flex-col">
                                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                                    {selectedProduct.name}
                                                </h2>
                                                <p className="text-gray-600 mb-6">
                                                    {selectedProduct.desc}
                                                </p>

                                                {/* Price */}
                                                <div className="mb-6">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        ${selectedProduct.price}
                                                    </span>
                                                </div>

                                                {/* Size Selection */}
                                                <div className="mb-6">
                                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                        Select Size
                                                    </h3>
                                                    <div className="flex gap-2">
                                                        {sizes.map((size) => (
                                                            <button
                                                                key={size}
                                                                onClick={() => setSelectedSize(size)}
                                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedSize === size
                                                                    ? "border-[#ff6a00] bg-[#ff6a00] text-white"
                                                                    : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                            >
                                                                {size}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3 mb-6">
                                                    <button
                                                        onClick={handleAddToCart}
                                                        className="flex-1 px-6 py-3 bg-[#ff6a00] text-white rounded-lg font-semibold hover:bg-[#ff7f33] transition-colors"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={handleAddToWishlist}
                                                        className={`px-6 py-3 border-2 rounded-lg transition-colors ${isInWishlist(selectedProduct.id)
                                                            ? "border-[#ff6a00] bg-[#ff6a00] text-white"
                                                            : "border-gray-200 hover:border-[#ff6a00] hover:text-[#ff6a00]"
                                                            }`}
                                                    >
                                                        <svg className="w-6 h-6" fill={isInWishlist(selectedProduct.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Product Details */}
                                                <div className="border-t border-gray-200 pt-6">
                                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                        Product Details
                                                    </h3>
                                                    <ul className="space-y-2 text-sm text-gray-600">
                                                        <li className="flex items-start">
                                                            <span className="text-[#ff6a00] mr-2">•</span>
                                                            <span>High-quality 3D printing technology</span>
                                                        </li>
                                                        <li className="flex items-start">
                                                            <span className="text-[#ff6a00] mr-2">•</span>
                                                            <span>Precision engineering and design</span>
                                                        </li>
                                                        <li className="flex items-start">
                                                            <span className="text-[#ff6a00] mr-2">•</span>
                                                            <span>Durable and long-lasting materials</span>
                                                        </li>
                                                        <li className="flex items-start">
                                                            <span className="text-[#ff6a00] mr-2">•</span>
                                                            <span>Customization options available</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Suggested Products */}
                                        <div className="border-t border-gray-200 pt-8">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                                You May Also Like
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {getSuggestedProducts(selectedProduct.id).map((product) => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setSelectedSize("Medium");
                                                        }}
                                                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                                    >
                                                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <div className="p-4">
                                                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#ff6a00] transition-colors">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-lg font-bold text-gray-900">
                                                                ${product.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
