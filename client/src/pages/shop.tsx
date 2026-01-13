import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { products } from "@/data/products";

export default function Shop() {
    const [, setLocation] = useLocation();
    const [selectedCategory, setSelectedCategory] = useState<string>("All Products");
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const PRODUCTS_PER_PAGE = 9;

    const categories = ["All Products", "3D Printing", "Design Services", "Prototyping"];

    const filteredProducts = selectedCategory === "All Products" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8 sm:mb-10 md:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Shop
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                            Discover our curated collection of innovative products and services
                        </p>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 sm:px-5 md:px-6 py-2 text-sm sm:text-base rounded-full font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-[#ff6a00] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
                        {paginatedProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setLocation(`/product/${product.id}`)}
                                className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-lg cursor-pointer w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]"
                            >
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 sm:p-5 md:p-6">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#ff6a00] transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                        {product.desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-lg font-medium ${
                                            currentPage === page
                                                ? 'bg-[#ff6a00] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-sm text-gray-600">
                                Showing {startIndex + 1}-{Math.min(startIndex + PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
