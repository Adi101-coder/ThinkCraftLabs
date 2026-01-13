import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useShop } from "@/contexts/ShopContext";
import { getProductById, getRelatedProducts, getRandomDeals } from "@/data/products";

export default function ProductDetail() {
    const params = useParams<{ id: string }>();
    const [, setLocation] = useLocation();
    const productId = parseInt(params.id || "0");
    const product = getProductById(productId);

    const [selectedSize, setSelectedSize] = useState<string>("Medium");
    const [quantity, setQuantity] = useState<number>(1);
    const { addToCart, addToWishlist, isInWishlist } = useShop();

    const sizes = ["Small", "Medium", "Large", "X-Large"];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [productId]);

    if (!product) {
        return (
            <div className="min-h-screen bg-white">
                <Navigation />
                <main className="pt-32 pb-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
                        <button
                            onClick={() => setLocation("/shop")}
                            className="px-6 py-3 bg-[#ff6a00] text-white rounded-lg font-semibold hover:bg-[#ff7f33]"
                        >
                            Back to Shop
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const relatedProducts = getRelatedProducts(product, 4);
    const deals = getRandomDeals(product.id, 3);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedSize);
        }
    };

    const handleAddToWishlist = () => {
        if (!isInWishlist(product.id)) {
            addToWishlist(product);
        }
    };


    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <button onClick={() => setLocation("/shop")} className="hover:text-[#ff6a00]">Shop</button>
                        <span>/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </nav>
                </div>

                {/* Product Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Image */}
                        <div className="rounded-2xl overflow-hidden bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover aspect-square"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <span className="text-sm text-[#ff6a00] font-medium mb-2">{product.category}</span>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <p className="text-gray-600 mb-6">{product.desc}</p>

                            <div className="text-4xl font-bold text-gray-900 mb-6">${product.price}</div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 font-medium ${selectedSize === size
                                                ? "border-[#ff6a00] bg-[#ff6a00] text-white"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 px-6 py-4 bg-[#ff6a00] text-white rounded-lg font-semibold hover:bg-[#ff7f33]"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleAddToWishlist}
                                    className={`px-6 py-4 border-2 rounded-lg ${isInWishlist(product.id)
                                        ? "border-[#ff6a00] bg-[#ff6a00] text-white"
                                        : "border-gray-200 hover:border-[#ff6a00] hover:text-[#ff6a00]"
                                        }`}
                                >
                                    <svg className="w-6 h-6" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#ff6a00]">•</span>
                                        <span>High-quality 3D printing technology</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#ff6a00]">•</span>
                                        <span>Precision engineering and design</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#ff6a00]">•</span>
                                        <span>Durable and long-lasting materials</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#ff6a00]">•</span>
                                        <span>Customization options available</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Retailer Info */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="w-16 h-16 bg-[#ff6a00] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                3D
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">3D Print Studio</h3>
                                <p className="text-gray-600 mb-2">Premium 3D Printing Services</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        4.9 (2.3k reviews)
                                    </span>
                                    <span>|</span>
                                    <span>500+ products sold</span>
                                </div>
                            </div>
                            <button className="px-6 py-2 border-2 border-[#ff6a00] text-[#ff6a00] rounded-lg font-medium hover:bg-[#ff6a00] hover:text-white">
                                View Store
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Similar Products</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setLocation(`/product/${p.id}`)}
                                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer"
                                >
                                    <div className="aspect-square bg-gray-100">
                                        <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#ff6a00]">{p.name}</h3>
                                        <p className="text-lg font-bold text-gray-900">${p.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hot Deals */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="bg-gradient-to-r from-[#ff6a00] to-[#ff8533] rounded-2xl p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">🔥 Hot Deals</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {deals.map((deal) => (
                                <div
                                    key={deal.id}
                                    onClick={() => setLocation(`/product/${deal.id}`)}
                                    className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg"
                                >
                                    <div className="flex items-center gap-4 p-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={deal.image} alt={deal.name} loading="lazy" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 line-clamp-1">{deal.name}</h3>
                                            <p className="text-[#ff6a00] font-bold">${deal.price}</p>
                                            <span className="text-xs text-green-600 font-medium">Limited offer</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Shipping & Returns Info */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-[#ff6a00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Free Shipping</h3>
                                <p className="text-sm text-gray-600">On orders over $100</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-[#ff6a00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
                                <p className="text-sm text-gray-600">30-day return policy</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-[#ff6a00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-[#ff6a00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                                <p className="text-sm text-gray-600">100% secure checkout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
