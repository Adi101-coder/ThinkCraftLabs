import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import { Users, Calendar, TrendingUp, Activity, Eye, Trash2, UserCheck } from "lucide-react";
import type { Event } from "../../../shared/schema";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  liveEvents: number;
}

export default function Admin() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0, liveEvents: 0 });
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [eventsRes, statsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/admin/stats"),
      ]);

      const eventsData = await eventsRes.json();
      setEvents(eventsData.events || []);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Calculate stats from events if endpoint doesn't exist
        const allEvents = eventsData.events || [];
        const totalRegistrations = allEvents.reduce((sum: number, e: Event) => sum + (e.registrations?.length || 0), 0);
        setStats({
          totalUsers: 0,
          totalEvents: allEvents.length,
          totalRegistrations,
          liveEvents: allEvents.filter((e: Event) => e.isLive).length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const viewRegistrations = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrations(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage events and view analytics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users size={24} className="text-blue-600" />
                </div>
                <TrendingUp size={20} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</h3>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar size={24} className="text-purple-600" />
                </div>
                <TrendingUp size={20} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalEvents}</h3>
              <p className="text-gray-600 text-sm">Total Events</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <UserCheck size={24} className="text-orange-600" />
                </div>
                <TrendingUp size={20} className="text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalRegistrations}</h3>
              <p className="text-gray-600 text-sm">Total Registrations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity size={24} className="text-green-600" />
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Live</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.liveEvents}</h3>
              <p className="text-gray-600 text-sm">Live Events</p>
            </div>
          </div>

          {/* Events Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">All Events</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registrations</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-500">by {event.createdByUsername}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewRegistrations(event)}
                          className="flex items-center gap-2 text-[#ff6a00] hover:text-[#e55f00] font-medium"
                        >
                          <Users size={16} />
                          {event.registrations?.length || 0}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {event.isLive ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">Scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewRegistrations(event)}
                            className="p-2 text-gray-600 hover:text-[#ff6a00] hover:bg-orange-50 rounded-lg transition-colors"
                            title="View registrations"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Registrations Modal */}
      {showRegistrations && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRegistrations(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
              <p className="text-gray-600 mt-1">{selectedEvent.registrations?.length || 0} registrations</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {selectedEvent.registrations && selectedEvent.registrations.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvent.registrations.map((reg, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ff6a00] rounded-full flex items-center justify-center text-white font-bold">
                          {reg.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{reg.username}</p>
                          <p className="text-sm text-gray-500">
                            Registered on {new Date(reg.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No registrations yet</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setShowRegistrations(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
