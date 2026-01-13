import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Students() {
    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            
            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Students Panel
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
                            Access exclusive events, workshops, and special offers
                        </p>
                    </div>

                    {/* Main Content Area - Add your content here */}
                    <div className="min-h-[50vh]">
                        {/* Your content goes here */}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
