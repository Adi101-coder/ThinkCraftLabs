import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    capacity: number;
    registered: number;
    type: string;
    createdBy: string;
    attendees: string[];
}

interface Offer {
    id: number;
    title: string;
    discount: string;
    validUntil: string;
    description: string;
    code: string;
}

export default function Students() {
    const { isAuthenticated, user } = useAuth();
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("events");
    const [copiedCode, setCopiedCode] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [joinedEvents, setJoinedEvents] = useState<number[]>([]);

    const [events, setEvents] = useState<Event[]>([
        { id: 1, title: "Introduction to 3D Printing Workshop", date: "2026-01-25", time: "10:00 AM", location: "Lab Room 101", description: "Learn the basics of 3D printing.", capacity: 30, registered: 18, type: "workshop", createdBy: "Admin", attendees: [] },
        { id: 2, title: "Advanced CAD Design Seminar", date: "2026-02-05", time: "3:00 PM", location: "Online (Zoom)", description: "Master advanced CAD techniques.", capacity: 50, registered: 32, type: "seminar", createdBy: "Admin", attendees: [] },
        { id: 3, title: "3D Printing Design Competition", date: "2026-02-15", time: "9:00 AM", location: "Main Campus Hall", description: "Showcase your creativity! Prizes worth $5000!", capacity: 100, registered: 67, type: "competition", createdBy: "Admin", attendees: [] },
    ]);

    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        capacity: 20,
        type: "workshop"
    });

    const offers: Offer[] = [
        { id: 1, title: "Student Discount", discount: "20% OFF", validUntil: "2026-06-30", description: "Exclusive discount for verified students.", code: "STUDENT20" },
        { id: 2, title: "First Print Free", discount: "100% OFF", validUntil: "2026-03-31", description: "Get your first small print free!", code: "FIRSTFREE" },
        { id: 3, title: "Bulk Order Discount", discount: "30% OFF", validUntil: "2026-12-31", description: "Order 5+ prints and get 30% off.", code: "BULK30" },
    ];

    const getTypeColor = (type: string) => {
        if (type === "workshop") return "bg-blue-100 text-blue-800";
        if (type === "seminar") return "bg-purple-100 text-purple-800";
        if (type === "competition") return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(""), 2000);
    };

    const handleCreateEvent = () => {
        if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) return;
        
        const event: Event = {
            id: Date.now(),
            ...newEvent,
            registered: 0,
            createdBy: user?.username || "Anonymous",
            attendees: []
        };
        
        setEvents([event, ...events]);
        setNewEvent({ title: "", date: "", time: "", location: "", description: "", capacity: 20, type: "workshop" });
        setShowCreateModal(false);
    };

    const handleJoinEvent = (eventId: number) => {
        if (!isAuthenticated) {
            setLocation("/login");
            return;
        }
        
        if (joinedEvents.includes(eventId)) return;
        
        setJoinedEvents([...joinedEvents, eventId]);
        setEvents(events.map(e => 
            e.id === eventId 
                ? { ...e, registered: e.registered + 1, attendees: [...e.attendees, user?.username || ""] }
                : e
        ));
    };

    const isEventFull = (event: Event) => event.registered >= event.capacity;
    const hasJoined = (eventId: number) => joinedEvents.includes(eventId);
