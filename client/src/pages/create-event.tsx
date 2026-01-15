import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, MapPin, Clock, Image, Zap, ArrowLeft, Check, Wrench, Trophy, BookOpen, Sparkles } from "lucide-react";
import type { Event } from "../../../shared/schema";

const eventTypes = [
  { value: "workshop", label: "Workshop", icon: Wrench, desc: "Hands-on learning experience" },
  { value: "competition", label: "Competition", icon: Trophy, desc: "Compete and showcase skills" },
  { value: "course", label: "Course", icon: BookOpen, desc: "Structured learning program" },
  { value: "other", label: "Other", icon: Calendar, desc: "Something unique" },
];

export default function CreateEvent() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as Event["category"] | "",
    images: "",
    date: "",
    location: "",
    isLive: false,
  });

  const handleSubmit = async () => {
    if (!formData.category) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          images: formData.images.split(",").map((url) => url.trim()).filter(Boolean),
        }),
      });
      if (response.ok) {
        setLocation("/students");
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.category !== "";
    if (step === 2) return formData.title.trim() !== "" && formData.description.trim() !== "";
    if (step === 3) return formData.date !== "";
    return true;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in Required</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to create an event.</p>
          <a href="/login" className="inline-block bg-[#ff6a00] text-white px-8 py-3 rounded-full font-medium">Sign In</a>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <Navigation />
      
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button onClick={() => setLocation("/students")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Students Hub</span>
          </button>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step > s ? "bg-[#ff6a00] text-white" : step === s ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {step > s ? <Check size={20} /> : s}
                  </div>
                  {s < 4 && <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${step > s ? "bg-[#ff6a00]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Type</span>
              <span>Details</span>
              <span>Schedule</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step 1: Event Type */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-[#ff6a00] px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  Step 1 of 4
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">What type of event?</h1>
                <p className="text-gray-600 text-lg">Choose the category that best describes your event</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.category === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, category: type.value as Event["category"] })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg ${
                        isSelected ? "border-[#ff6a00] bg-orange-50 shadow-lg" : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                        isSelected ? "bg-[#ff6a00] text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        <Icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{type.label}</h3>
                      <p className="text-gray-500">{type.desc}</p>
                      {isSelected && (
                        <div className="mt-4 flex items-center gap-2 text-[#ff6a00] font-medium">
                          <Check size={18} />Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          {/* Step 2: Event Details */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-[#ff6a00] px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  Step 2 of 4
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Tell us about it</h1>
                <p className="text-gray-600 text-lg">Give your event a name and description</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-xl focus:border-[#ff6a00] focus:ring-0 outline-none transition-colors"
                    placeholder="Give your event a catchy name"
                    maxLength={100}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-400">{formData.title.length}/100</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff6a00] focus:ring-0 outline-none transition-colors resize-none"
                    rows={6}
                    placeholder="What will participants learn or experience? Be descriptive..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Location */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-[#ff6a00] px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  Step 3 of 4
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">When & Where</h1>
                <p className="text-gray-600 text-lg">Set the date, time, and location</p>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Clock size={18} className="text-[#ff6a00]" />Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff6a00] focus:ring-0 outline-none transition-colors text-lg"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <MapPin size={18} className="text-[#ff6a00]" />Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff6a00] focus:ring-0 outline-none transition-colors"
                    placeholder="Room 101, Engineering Building"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Image size={18} className="text-[#ff6a00]" />Cover Image URL (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#ff6a00] focus:ring-0 outline-none transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Live Event Toggle */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#ff6a00] rounded-xl flex items-center justify-center">
                        <Zap size={24} className="text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-lg">Mark as Live Event</span>
                        <p className="text-gray-600 text-sm">Highlight this in the "Live Now" section</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isLive: !formData.isLive })}
                      className={`w-16 h-9 rounded-full transition-colors relative ${formData.isLive ? "bg-[#ff6a00]" : "bg-gray-300"}`}
                    >
                      <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform ${formData.isLive ? "translate-x-8" : "translate-x-1"}`} />
                    </button>
                  </label>
                </div>
              </div>
            </div>
          )}


          {/* Step 4: Review */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Check size={16} />
                  Final Step
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Looking good!</h1>
                <p className="text-gray-600 text-lg">Review your event before publishing</p>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                {/* Preview Header */}
                <div className="bg-black p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">{formData.category}</span>
                    {formData.isLive && (
                      <span className="px-3 py-1 bg-[#ff6a00] rounded-full text-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />Live
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold">{formData.title || "Untitled Event"}</h2>
                </div>

                {/* Preview Body */}
                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h4>
                    <p className="text-gray-700 text-lg leading-relaxed">{formData.description || "No description provided"}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ff6a00]/10 rounded-lg flex items-center justify-center">
                          <Clock size={20} className="text-[#ff6a00]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="font-semibold text-gray-900">
                            {formData.date ? new Date(formData.date).toLocaleString() : "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#ff6a00]/10 rounded-lg flex items-center justify-center">
                          <MapPin size={20} className="text-[#ff6a00]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-semibold text-gray-900">{formData.location || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {formData.images && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Cover Image</h4>
                      <img src={formData.images.split(",")[0]} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-8 py-4 rounded-full font-medium transition-all ${
                  canProceed()
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-4 bg-[#ff6a00] text-white rounded-full font-medium hover:bg-[#e55f00] transition-colors flex items-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Publish Event
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
