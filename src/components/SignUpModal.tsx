import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ArrowRight, Calendar, Clock, Sparkles, AlertCircle } from "lucide-react";
import { SignupUser } from "../types";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: (newCount: number, recentSignup: any) => void;
  initialGoal?: string;
}

const goals = [
  { id: "Reduce Anxiety", label: "Reduce anxiety & quiet the mind", icon: "🧘" },
  { id: "Improve Sleep", label: "Fall asleep faster & rest deeply", icon: "🌙" },
  { id: "Improve Focus", label: "Boost cognitive focus & productivity", icon: "⚡" },
  { id: "Manage Stress", label: "Better daily emotional resilience", icon: "🛡️" },
  { id: "Explore", label: "Just exploring mindfulness tools", icon: "✨" },
];

const mockSlots = [
  { id: "slot-1", day: "Tomorrow", time: "10:00 AM" },
  { id: "slot-2", day: "Tomorrow", time: "2:30 PM" },
  { id: "slot-3", day: "Monday, Jun 29", time: "11:00 AM" },
  { id: "slot-4", day: "Monday, Jun 29", time: "4:00 PM" },
];

export default function SignUpModal({ isOpen, onClose, onSignupSuccess, initialGoal }: SignUpModalProps) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [signupResult, setSignupResult] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSlotBooked, setIsSlotBooked] = useState(false);

  useEffect(() => {
    if (initialGoal) {
      setSelectedGoal(initialGoal);
    }
  }, [initialGoal]);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError("");
      setName("");
      setEmail("");
      setSignupResult(null);
      setSelectedSlot("");
      setIsSlotBooked(false);
    }
  }, [isOpen]);

  const handleNextStep = () => {
    if (step === 1 && !selectedGoal) {
      setError("Please select a goal to customize your experience.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          goal: selectedGoal,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register waitlist.");
      }

      const data = await response.json();
      setSignupResult(data);
      onSignupSuccess(data.totalCount, data.signup);
      setStep(3);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSlot = () => {
    if (!selectedSlot) return;
    setIsSlotBooked(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0d0d0d] p-6 shadow-2xl md:p-8 border border-white/5 text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Step Indicators */}
            <div className="mb-6 flex items-center gap-2">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? "w-8 bg-indigo-500" : "w-4 bg-white/10"}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? "w-8 bg-indigo-500" : "w-4 bg-white/10"}`} />
              <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? "w-8 bg-indigo-500" : "w-4 bg-white/10"}`} />
              <span className="ml-auto text-xs font-mono text-white/40">Step {step} of 3</span>
            </div>

            {/* STEP 1: GOAL SELECTION */}
            {step === 1 && (
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white mb-2">
                  Tailor your clinical companion
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  Select your primary emotional or cognitive focus area so Aura AI can personalize your daily exercises.
                </p>

                <div className="space-y-3 mb-6">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGoal(g.id);
                        setError("");
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                        selectedGoal === g.id
                          ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <span className="font-medium text-white/90 text-sm">{g.label}</span>
                      {selectedGoal === g.id && (
                        <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 text-red-400 text-xs font-medium">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all text-sm shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2: USER INFO */}
            {step === 2 && (
              <form onSubmit={handleSubmitSignup}>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-white mb-2">
                  Claim your priority rank
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  Aura AI is currently rolling out in batches. Join the private beta and receive personalized daily routines.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-300 mb-1.5 uppercase tracking-wider">
                      Your First & Last Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white/5 text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-indigo-300 mb-1.5 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white/5 text-white transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 text-red-400 text-xs font-medium">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white/90 font-medium py-3.5 px-6 rounded-2xl transition-colors text-sm cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all text-sm shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    {isSubmitting ? "Securing slot..." : "Claim Beta Access"}
                    {!isSubmitting && <Sparkles size={16} />}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: BOOK DEMO & RANK SUMMARY */}
            {step === 3 && signupResult && (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                  <Check size={28} strokeWidth={2.5} />
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-1">
                  Welcome to Aura, {name.split(" ")[0]}!
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  You have successfully claimed your beta waitlist reservation.
                </p>

                {/* Rank Badge */}
                <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                    Your Confirmed Reservation Rank
                  </span>
                  <span className="font-display text-3xl font-extrabold text-white tracking-tight">
                    #{signupResult.signup.waitlistRank.toLocaleString()}
                  </span>
                  <p className="text-xs text-white/40 mt-2">
                    An email invitation has been sent to <span className="text-indigo-300">{email}</span>.
                  </p>
                </div>

                {/* Optional Schedule Demo Integration to boost conversions further */}
                {!isSlotBooked ? (
                  <div className="text-left border-t border-white/10 pt-5">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-white/95 mb-2">
                      <Calendar size={16} className="text-indigo-400" />
                      Book a complimentary 15-min VIP Onboarding
                    </h4>
                    <p className="text-xs text-white/50 mb-4">
                      Skip 5,000+ ranks by booking a quick 1-on-1 virtual platform tour with a mental wellness guide.
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {mockSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedSlot === slot.id
                              ? "border-indigo-500 bg-indigo-500/10 text-white"
                              : "border-white/10 hover:border-white/25 bg-white/5 text-white/70"
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-semibold tracking-wider ${selectedSlot === slot.id ? "text-indigo-300" : "text-white/40"}`}>
                            {slot.day}
                          </span>
                          <span className="text-xs font-bold mt-0.5">{slot.time}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={!selectedSlot}
                      onClick={handleBookSlot}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/5 disabled:text-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all text-xs cursor-pointer"
                    >
                      <Clock size={14} /> Confirm Demo Slot
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border-t border-white/10 pt-5 text-center text-xs"
                  >
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <p className="font-bold text-white">Demo Scheduled Successfully!</p>
                    <p className="text-white/40 mt-1">
                      Check your email for the Google Meet joining link and calendar invitation.
                    </p>
                  </motion.div>
                )}

                <button
                  onClick={onClose}
                  className="mt-6 text-xs text-white/40 hover:text-white underline font-medium cursor-pointer"
                >
                  Close & Explore Dashboard Mockup
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
