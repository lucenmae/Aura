import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Users, TrendingUp } from "lucide-react";
import { SignupUser } from "../types";

interface ActivityTickerProps {
  recentSignups: SignupUser[];
}

const mockRecentCities = [
  "London", "New York", "San Francisco", "Tokyo", "Berlin", "Sydney", "Toronto", "Paris"
];

export default function ActivityTicker({ recentSignups }: ActivityTickerProps) {
  const [tickerItems, setTickerItems] = useState<any[]>([]);

  useEffect(() => {
    // Generate some diverse starting feed items
    const baseItems = recentSignups.map((s, i) => ({
      ...s,
      city: mockRecentCities[i % mockRecentCities.length]
    }));
    setTickerItems(baseItems);
  }, [recentSignups]);

  if (tickerItems.length === 0) return null;

  return (
    <div className="w-full bg-[#0d0d0d] text-white/95 py-2.5 overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 overflow-hidden">
        
        {/* Left Indicator */}
        <div className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Beta Activity
        </div>

        {/* Rolling Marquee container */}
        <div className="flex-1 overflow-hidden relative h-5">
          <motion.div
            animate={{
              x: [0, -1000],
            }}
            transition={{
              ease: "linear",
              duration: 35,
              repeat: Infinity,
            }}
            className="flex gap-12 whitespace-nowrap absolute left-0"
          >
            {/* Double the list to support seamless infinite loops */}
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <div key={index} className="flex items-center gap-2.5 text-xs">
                <span className="font-semibold text-white">{item.name}</span>
                <span className="text-white/40 font-mono text-[11px]">({item.city || "Berlin"})</span>
                <span className="text-white/60">claimed rank #{item.waitlistRank.toLocaleString()} to</span>
                <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                  {item.goal}
                </span>
                <span className="text-indigo-400 font-medium font-mono text-[10px]">• {item.timestamp || "Just now"}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Metric */}
        <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap text-xs text-white/40 font-mono">
          <Users size={13} className="text-indigo-400" />
          <span>Active Users: <strong className="text-white font-semibold">24,192</strong></span>
        </div>

      </div>
    </div>
  );
}
