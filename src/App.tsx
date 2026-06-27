import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, ShieldAlert, BadgeCheck, Trophy, Check, ArrowRight, Heart } from "lucide-react";
import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import ActivityTicker from "./components/ActivityTicker";
import InteractiveCards from "./components/InteractiveCards";
import { SignupUser } from "./types";

export default function App() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [totalWaitlist, setTotalWaitlist] = useState(14214);
  const [recentSignups, setRecentSignups] = useState<SignupUser[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [quickEmail, setQuickEmail] = useState("");
  const [videoTimer, setVideoTimer] = useState(15);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch count and recent registrations
  useEffect(() => {
    async function fetchData() {
      try {
        const countRes = await fetch("/api/signups/count");
        if (countRes.ok) {
          const countData = await countRes.json();
          setTotalWaitlist(countData.count);
        }

        const recentRes = await fetch("/api/signups/recent");
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          setRecentSignups(recentData.signups);
        }
      } catch (err) {
        console.warn("Failed to fetch waitlist stats from API, using fallback state.");
      }
    }
    fetchData();
  }, []);

  const handleSignupSuccess = (newCount: number, recentSignup: any) => {
    setTotalWaitlist(newCount);
    setRecentSignups((prev) => [recentSignup, ...prev]);
  };

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail.trim() || !quickEmail.includes("@")) return;
    setIsSubscribed(true);
    // Open full modal but with email filled
    setSelectedGoal("Explore");
    setIsSignUpOpen(true);
  };

  // Breathing simulation timer
  useEffect(() => {
    let timer: any;
    if (isVideoPlaying && videoTimer > 0) {
      timer = setInterval(() => {
        setVideoTimer((prev) => (prev === 1 ? 15 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying, videoTimer]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      
      {/* Upper Navigation */}
      <Navbar onLoginClick={() => {
        setSelectedGoal("Explore");
        setIsSignUpOpen(true);
      }} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12 w-full flex-1 relative">
        {/* Background Glow Decor as requested by the style guide */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Highly persuasive marketing copy & credentials */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left relative z-10">
            
            {/* Social Proof Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-start items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full shadow-sm text-xs text-indigo-300 font-semibold uppercase tracking-wider"
            >
              <div className="flex -space-x-2 mr-1">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format"
                  alt="Sarah Connor"
                  className="h-5 w-5 rounded-full object-cover border border-[#0a0a0a] ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format"
                  alt="David Mark"
                  className="h-5 w-5 rounded-full object-cover border border-[#0a0a0a] ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format"
                  alt="Aria Lynn"
                  className="h-5 w-5 rounded-full object-cover border border-[#0a0a0a] ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&auto=format"
                  alt="Marcus Todd"
                  className="h-5 w-5 rounded-full object-cover border border-[#0a0a0a] ring-1 ring-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-white/60 font-medium font-sans normal-case tracking-normal">
                Trusted by <strong className="text-white font-semibold">14,000+</strong> innovators
              </span>
            </motion.div>

            {/* Headline Title (Swiss high-contrast typography) */}
            <div className="flex flex-col gap-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.05]"
              >
                Technically driven <br />
                <span className="text-indigo-400 font-normal italic font-sans mr-2">Mental Health</span>
                Solution <br />
                with AI
              </motion.h1>
            </div>

            {/* Supporting Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl font-normal font-sans"
            >
              Streamlines interventions by consolidating them within one platform, reducing the need for multiple point solutions.
            </motion.p>

            {/* Primary Action Row (Buttons pill) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              <button
                onClick={() => {
                  setSelectedGoal("Explore");
                  setIsSignUpOpen(true);
                }}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2 tracking-wide"
              >
                Schedule Demo
              </button>

              {/* Serene Breath simulation launcher */}
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-4 rounded-full text-xs font-bold text-white transition-all shadow-sm"
              >
                <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <Play size={10} className="fill-white ml-0.5 text-white" />
                </div>
                Try Breathing Guide
              </button>
            </motion.div>

            {/* Instant Conversion Action Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-t border-white/10 pt-6 mt-3 max-w-md"
            >
              <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-indigo-300 mb-3">
                Secure Early Beta Invitation
              </h3>
              
              <form onSubmit={handleQuickSignup} className="flex gap-2 mb-3.5 bg-white/5 p-1.5 border border-white/10 rounded-2xl">
                <input
                  type="email"
                  required
                  placeholder="Enter email to skip queue..."
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-2.5 outline-none text-white placeholder:text-white/30 text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1 shrink-0 active:scale-95 shadow-md shadow-indigo-500/10"
                >
                  Join Waitlist <ArrowRight size={13} />
                </button>
              </form>

              {/* Conversion credibility checklist */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[10px] text-white/40 font-mono">
                <div className="flex items-center gap-1.5 font-medium">
                  <BadgeCheck size={13} className="text-indigo-400" />
                  HIPAA Compliant & Secure
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Trophy size={13} className="text-indigo-400 fill-indigo-400/10" />
                  Clinical-Grade CBT Engine
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Check size={13} className="text-indigo-400" strokeWidth={3} />
                  Zero Platform Integration Fee
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles size={13} className="text-indigo-400 fill-indigo-400/10" />
                  Personalized via Gemini 3.5
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Float layered interactive mockup bento box */}
          <div className="lg:col-span-7">
            <InteractiveCards />
          </div>

        </div>
      </main>

      {/* Social Proof Dynamic Activity Marquee */}
      <div className="mt-8">
        <ActivityTicker recentSignups={recentSignups} />
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full py-6 text-center text-[11px] text-white/30 font-sans border-t border-white/5 mt-4 max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} Aura AI Technologies Inc. All rights reserved. Aura is a digital therapeutic companion designed to aid and enhance behavioral health practices. It does not replace professional clinical therapy.</p>
      </footer>

      {/* MODAL 1: Interactive Sign Up Waitlist & Demo scheduler */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignupSuccess={handleSignupSuccess}
        initialGoal={selectedGoal}
      />

      {/* MODAL 2: Interactive Breathing Guide Modal (Try Breathing) */}
      <AnimatePresence>
        {isVideoPlaying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVideoPlaying(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 text-white rounded-3xl p-6 md:p-8 text-center border border-neutral-800 shadow-2xl"
            >
              {/* Close */}
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <XIcon size={18} />
              </button>

              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold mb-1 block">Live Breathing Guide</span>
              <h3 className="font-display text-xl font-bold mb-4">Soma Coherence Breath</h3>
              
              {/* Pulsating breathing circle */}
              <div className="my-8 flex items-center justify-center relative">
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.45, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-28 h-28 rounded-full bg-emerald-500/20 blur-md"
                />

                {/* Inner solid ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.35, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex flex-col items-center justify-center shadow-lg relative z-10"
                >
                  <motion.span
                    animate={{
                      opacity: [1, 0.8, 1]
                    }}
                    className="text-xs font-mono font-bold text-white uppercase tracking-wider"
                  >
                    {videoTimer > 10 ? "Inhale..." : videoTimer > 5 ? "Hold..." : "Exhale..."}
                  </motion.span>
                  <span className="text-xl font-extrabold mt-0.5">{videoTimer}s</span>
                </motion.div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto mb-6">
                Place your feet flat on the floor, relax your shoulders, and synchronize your inhale as the circle expands, hold, then let go as it contracts.
              </p>

              <button
                onClick={() => {
                  setIsVideoPlaying(false);
                  setIsSignUpOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-white text-neutral-900 hover:bg-neutral-100 font-bold py-3.5 px-6 rounded-2xl transition-all text-xs"
              >
                Claim Beta Spot to Unlock All 12 Guides
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple internal X icon for modal
function XIcon({ size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}

