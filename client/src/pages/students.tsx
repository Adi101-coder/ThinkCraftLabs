import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Calendar, MapPin, Trash2, Clock, Users, Trophy, BookOpen, Wrench } from "lucide-react";
import type { Event } from "../../../shared/schema";

const categoryIcons: Record<string, typeof Calendar> = {
    workshop: Wrench,
    competition: Trophy,
    course: BookOpen,
    other: Calendar,
};

const categoryColors: Record<string, string> = {
    workshop: "bg-blue-100 text-blue-800 border-blue-200",
    competition: "bg-purple-100 text-purple-800 border-purple-200",
    course: "bg-green-100 text-green-800 border-green-200",
    other: "bg-gray-100 text-gray-800 border-gray-200",
};

const testimonials = [
    {
        name: "Alex Chen",
        role: "Engineering Student",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        quote: "The 3D printing workshops completely changed my approach to prototyping!",
    },
    {
        name: "Sarah Johnson",
        role: "Design Major",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        quote: "Winning the design competition gave me the confidence to pursue my passion.",
    },
    {
        name: "Michael Park",
        role: "Robotics Club Lead",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        quote: "The courses offered here are top-notch. I learned advanced techniques.",
    },
];

const featuredImages = [
    { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop", title: "3D Printing Workshop", category: "workshop" },
    { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop", title: "Design Competition", category: "competition" },
    { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop", title: "Advanced Modeling Course", category: "course" },
    { url: "https://images.unsplash.com/photo-1563520240344-52b067aa5f84?w=400&h=300&fit=crop", title: "Prototype Development", category: "workshop" },
];


export default function Students() {
    const { user, isAuthenticated } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [liveEvents, setLiveEvents] = useState<Event[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
        fetchLiveEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch("/api/events");
            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLiveEvents = async () => {
        try {
            const response = await fetch("/api/events?live=true");
            const data = await response.json();
            setLiveEvents(data.events || []);
        } catch (error) {
            console.error("Failed to fetch live events:", error);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const response = await fetch("/api/events/" + eventId, { method: "DELETE", credentials: "include" });
            if (response.ok) { fetchEvents(); fetchLiveEvents(); }
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    const filteredEvents = activeCategory === "all" ? events : events.filter((e) => e.category === activeCategory);
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });



    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            <main className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Students Hub</h1>
                            <p className="text-base sm:text-lg text-gray-600 max-w-2xl">Discover workshops, competitions, courses, and connect with fellow makers</p>
                        </div>
                        {isAuthenticated && (
                            <a href="/create-event" className="flex items-center gap-2 bg-[#ff6a00] text-white px-6 py-3 rounded-full hover:bg-[#e55f00] transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105">
                                <Plus size={20} />Add Event
                            </a>
                        )}
                    </div>

                    {liveEvents.length > 0 && (
                        <section className="mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full animate-pulse">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>LIVE NOW
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Active Events</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {liveEvents.map((event) => {
                                    const IconComponent = categoryIcons[event.category] || Calendar;
                                    return (
                                        <div key={event._id} className="relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-xl transition-all">
                                            <div className="absolute top-4 right-4 flex items-center gap-1 text-emerald-600 text-sm font-medium">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>Live
                                            </div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-3 bg-white rounded-xl shadow-sm"><IconComponent size={24} className="text-emerald-600" /></div>
                                                <span className={"px-3 py-1 rounded-full text-xs font-medium border " + categoryColors[event.category]}>{event.category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1"><Clock size={16} />{formatDate(event.date)}</div>
                                                {event.location && <div className="flex items-center gap-1"><MapPin size={16} />{event.location}</div>}
                                            </div>
                                            {isAuthenticated && user && event.createdBy === user.id && (
                                                <button onClick={() => handleDelete(event._id)} className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}


                    <section className="mb-8">
                        <div className="flex flex-wrap gap-3">
                            {["all", "workshop", "competition", "course", "other"].map((category) => (
                                <button key={category} onClick={() => setActiveCategory(category)} className={"px-5 py-2 rounded-full font-medium transition-all " + (activeCategory === category ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse"></div>)}
                            </div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl">
                                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 text-lg">No events found in this category</p>
                                {isAuthenticated && <a href="/create-event" className="mt-4 text-black font-medium hover:underline inline-block">Create the first one</a>}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => {
                                    const IconComponent = categoryIcons[event.category] || Calendar;
                                    return (
                                        <div key={event._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all group">
                                            {event.images && event.images.length > 0 && (
                                                <div className="mb-4 rounded-xl overflow-hidden">
                                                    <img src={event.images[0]} alt={event.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-gray-100 rounded-lg"><IconComponent size={20} className="text-gray-700" /></div>
                                                <span className={"px-3 py-1 rounded-full text-xs font-medium border " + categoryColors[event.category]}>{event.category}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-black">{event.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                            <div className="flex flex-col gap-2 text-sm text-gray-500">
                                                <div className="flex items-center gap-2"><Clock size={14} />{formatDate(event.date)}</div>
                                                {event.location && <div className="flex items-center gap-2"><MapPin size={14} />{event.location}</div>}
                                            </div>
                                            {isAuthenticated && user && event.createdBy === user.id && (
                                                <button onClick={() => handleDelete(event._id)} className="mt-4 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium">
                                                    <Trash2 size={14} />Delete
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>


                    <section className="mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Featured Activities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredImages.map((img, index) => (
                                <div key={index} className="relative rounded-xl overflow-hidden group cursor-pointer">
                                    <img src={img.url} alt={img.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="font-bold">{img.title}</p>
                                            <p className="text-sm text-gray-300 capitalize">{img.category}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Student Stories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-black text-white rounded-3xl p-8 sm:p-12 mb-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div><div className="text-4xl sm:text-5xl font-bold mb-2">500+</div><div className="text-gray-400">Students Engaged</div></div>
                            <div><div className="text-4xl sm:text-5xl font-bold mb-2">50+</div><div className="text-gray-400">Workshops Held</div></div>
                            <div><div className="text-4xl sm:text-5xl font-bold mb-2">25+</div><div className="text-gray-400">Competitions</div></div>
                            <div><div className="text-4xl sm:text-5xl font-bold mb-2">100+</div><div className="text-gray-400">Projects Created</div></div>
                        </div>
                    </section>

                    <section className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Users size={24} className="text-gray-600" />
                            <span className="text-gray-600 font-medium">Join Our Community</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Start Creating?</h2>
                        <p className="text-gray-600 max-w-xl mx-auto mb-8">Whether you're a beginner or an experienced maker, there's a place for you here.</p>
                        <a href="/signup" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors">Get Started Today</a>
                    </section>
                </div>
            </main>


            <Footer />
        </div>
    );
}
