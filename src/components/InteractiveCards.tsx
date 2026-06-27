import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Check, Play, Clipboard, RotateCcw, Plus, Trash2, Heart, CheckCircle2 } from "lucide-react";
import { MoodType, MentalTask, AffirmationResult } from "../types";

// Dynamic tasks tailored to moods
const initialTasks: Record<MoodType, MentalTask[]> = {
  Anxious: [
    { id: "a1", title: "15 min, Meditation", duration: "15 min", category: "Meditation", completed: false },
    { id: "a2", title: "Take a deep breath - inhale 4s", duration: "4 min", category: "Breathing", completed: false },
    { id: "a3", title: "Feeling anxious? Try grounding", duration: "5 min", category: "Grounding", completed: false },
  ],
  Sad: [
    { id: "s1", title: "Gentle somatic stretching", duration: "10 min", category: "Grounding", completed: false },
    { id: "s2", title: "Write 3 things you love about yourself", duration: "5 min", category: "Reflection", completed: false },
    { id: "s3", title: "Inhale warm light breathing", duration: "5 min", category: "Breathing", completed: false },
  ],
  Calm: [
    { id: "c1", title: "Deep silence insight session", duration: "20 min", category: "Meditation", completed: false },
    { id: "c2", title: "Acknowledge the quiet present state", duration: "3 min", category: "Reflection", completed: false },
    { id: "c3", title: "Slow coherence breath balance", duration: "6 min", category: "Breathing", completed: false },
  ],
  Energetic: [
    { id: "e1", title: "Vibrant box breathing focus", duration: "5 min", category: "Breathing", completed: false },
    { id: "e2", title: "Channel flow creative journaling", duration: "10 min", category: "Reflection", completed: false },
    { id: "e3", title: "Walking meditation focus", duration: "15 min", category: "Meditation", completed: false },
  ],
  Tired: [
    { id: "t1", title: "NSDR (Non-Sleep Deep Rest) reload", duration: "15 min", category: "Meditation", completed: false },
    { id: "t2", title: "Release tension body scan", duration: "8 min", category: "Grounding", completed: false },
    { id: "t3", title: "Extended soothing exhalations", duration: "5 min", category: "Breathing", completed: false },
  ]
};

const moodsList: { mood: MoodType; emoji: string; color: string; label: string }[] = [
  { mood: "Anxious", emoji: "🥺", color: "from-amber-400 to-orange-500", label: "Anxious" },
  { mood: "Sad", emoji: "😔", color: "from-blue-400 to-indigo-600", label: "Sad" },
  { mood: "Calm", emoji: "😊", color: "from-emerald-400 to-teal-600", label: "Calm" },
  { mood: "Energetic", emoji: "🤩", color: "from-pink-400 to-rose-600", label: "Energetic" },
  { mood: "Tired", emoji: "😴", color: "from-purple-400 to-violet-600", label: "Tired" },
];

export default function InteractiveCards() {
  const [selectedMood, setSelectedMood] = useState<MoodType>("Calm");
  const [moodSliderVal, setMoodSliderVal] = useState(2); // index 2 is Calm
  const [tasks, setTasks] = useState<MentalTask[]>(initialTasks["Calm"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customAffirmation, setCustomAffirmation] = useState<AffirmationResult>({
    affirmation: "My mind is clear, peaceful, and anchored. I move through my day with effortless grace and spacious attention.",
    grounding: "Notice the sensation of gravity holding you right now, appreciating the quiet strength of your posture."
  });
  const [extraContext, setExtraContext] = useState("");
  const [copied, setCopied] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  // Sync Slider to Mood click
  const handleMoodClick = (mood: MoodType, index: number) => {
    setSelectedMood(mood);
    setMoodSliderVal(index);
    setTasks(initialTasks[mood]);
  };

  // Sync Mood to Slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setMoodSliderVal(val);
    const moodObj = moodsList[val];
    setSelectedMood(moodObj.mood);
    setTasks(initialTasks[moodObj.mood]);
  };

  // Trigger Gemini AI generation for custom Affirmation
  const generateAIAffirmation = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          notes: extraContext,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCustomAffirmation({
        affirmation: data.affirmation,
        grounding: data.grounding,
        isDemo: data.isDemo,
      });
    } catch (err) {
      // safe fallback (already handled by server as well)
      setCustomAffirmation({
        affirmation: "I welcome each breath as a fresh beginning, trusting my inner strength to navigate any storm.",
        grounding: "Trace the outline of your hand slowly, taking one full breath for each finger."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Affirmation: ${customAffirmation.affirmation}\nGrounding: ${customAffirmation.grounding}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: MentalTask = {
      id: "custom-" + Date.now(),
      title: newTaskTitle.trim(),
      duration: "5 min",
      category: "Reflection",
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle("");
    setShowAddTask(false);
  };

  const handleRemoveTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">

      {/* Decorative Glow background reflecting active mood */}
      <div className={`absolute -inset-10 bg-gradient-to-tr ${moodsList[moodSliderVal].color} opacity-10 blur-[80px] rounded-full transition-all duration-700 pointer-events-none`} />

      {/* Hero Illustration: Beautiful generated head silhouette portrait */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-white/10 shadow-inner">
        <img
          src="/src/assets/images/head_silhouette_1782523469608.jpg"
          alt="Technical Mental Health Silhouette"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none pointer-events-none opacity-80 transition-all duration-700 hover:scale-105"
        />
        {/* Iridescent badge overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5 text-[11px] font-medium text-white">
          <Sparkles size={12} className="text-indigo-400 animate-pulse" />
          Neural Flow Representation
        </div>
      </div>

      {/* CARD 1: FEELINGS TRACKER (Interactive slide/click grid) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass rounded-3xl p-6 relative overflow-hidden transition-all duration-500 border border-white/10 shadow-md hover:shadow-lg"
      >
        <div className="flex flex-col gap-1 mb-5">
          <h4 className="font-display text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Heart size={16} className="text-indigo-400 fill-indigo-400" />
            How Are You Feeling Today?
          </h4>
          <p className="text-xs text-white/60">
            Slide or tap to express your mental state. Aura instantly re-aligns your exercises.
          </p>
        </div>

        {/* Emojis selection grid */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {moodsList.map((item, idx) => (
            <button
              key={item.mood}
              onClick={() => handleMoodClick(item.mood, idx)}
              className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedMood === item.mood
                  ? "border-indigo-500 bg-indigo-500/10 text-white scale-105 shadow-sm font-semibold"
                  : "border-transparent bg-white/5 hover:bg-white/10 text-white/50 hover:scale-102"
              }`}
            >
              <span className="text-2xl filter drop-shadow-sm select-none">{item.emoji}</span>
              <span className="text-[10px] tracking-wide uppercase font-mono">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Real Interactive Slider Track */}
        <div className="relative px-3 py-4 bg-white/5 rounded-2xl border border-white/10">
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={moodSliderVal}
            onChange={handleSliderChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
          />
          <div className="flex justify-between text-[9px] font-bold font-mono text-white/40 mt-2 px-1">
            <span>ANXIOUS</span>
            <span>SAD</span>
            <span>CALM</span>
            <span>ACTIVE</span>
            <span>TIRED</span>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: TODAY'S AFFIRMATION (With real-time Gemini AI generator!) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass rounded-3xl p-6 border border-white/10 shadow-md relative"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Guide Profile Avatar */}
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold shadow">
              AI
            </div>
            <div>
              <span className="block text-xs font-semibold text-white/40 uppercase tracking-wider font-mono">Today's Affirmation</span>
              <h4 className="text-sm font-bold text-white">Dr. Aura Clinical Companion</h4>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[10px] font-mono text-indigo-300">
            <span className={`h-1.5 w-1.5 rounded-full ${customAffirmation.isDemo ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
            {customAffirmation.isDemo ? "Curated" : "Gemini 3.5 AI"}
          </div>
        </div>

        {/* Display Affirmation Box */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5 shadow-sm relative overflow-hidden group">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 gap-3"
              >
                <div className="flex space-x-2">
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-xs font-mono font-medium text-white/50 animate-pulse">Syncing neural therapy modules...</span>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-wider text-white/40 block uppercase mb-1">Affirmation</span>
                  <p className="text-white text-[14px] leading-relaxed font-medium italic">
                    "{customAffirmation.affirmation}"
                  </p>
                </div>
                {customAffirmation.grounding && (
                  <div className="border-t border-white/10 pt-3">
                    <span className="text-[10px] font-bold font-mono tracking-wider text-white/40 block uppercase mb-1">Recommended Grounding Exercise</span>
                    <p className="text-white/75 text-xs leading-relaxed">
                      {customAffirmation.grounding}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Input & Action Panel */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What is weighing on your mind? (optional)..."
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none text-white focus:bg-white/5 transition-all shadow-inner placeholder:text-white/30"
            />
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500 hover:text-white border border-white/10 transition-all flex items-center justify-center text-white/50 shadow-sm cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Clipboard size={14} />}
            </button>
          </div>

          <button
            onClick={generateAIAffirmation}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 text-white font-semibold py-3 px-5 rounded-2xl transition-colors text-xs shadow-md shadow-indigo-500/10 cursor-pointer"
          >
            <Sparkles size={13} className="text-amber-400 fill-amber-400 animate-pulse" />
            {isGenerating ? "Consulting Aura AI Companion..." : `Generate Personalized AI Affirmation for ${selectedMood}`}
          </button>
        </div>
      </motion.div>

      {/* CARD 3: DAILY MINDFULNESS ROUTINES (With mini calendar & checkbox tracking) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="glass rounded-3xl p-6 border border-white/10 shadow-md"
      >
        {/* Calendar View & Summary Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4 mb-5">
          <div>
            <span className="text-[10px] font-bold font-mono text-white/40 tracking-wider uppercase">Your Routine Schedule</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar size={15} className="text-white/50" />
              <h4 className="font-display font-semibold text-[15px] text-white">Mindfulness Flow</h4>
            </div>
          </div>

          {/* Miniature Calendar UI */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-sm">
            {["29", "30", "1", "2", "3", "4", "5"].map((day, i) => {
              const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
              const isActive = day === "1" || day === "2"; // e.g. active dates
              return (
                <div
                  key={day}
                  className={`flex flex-col items-center justify-center w-8 py-1 rounded-lg text-center ${
                    isActive ? "bg-indigo-500 text-white font-bold" : "text-white/40 font-medium"
                  }`}
                >
                  <span className="text-[8px] uppercase tracking-wider font-mono mb-0.5">{daysOfWeek[i]}</span>
                  <span className="text-xs">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mb-5 bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-white/70">Routines Completed</span>
              <span className="text-white font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 bg-indigo-500 text-white px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold">
            <CheckCircle2 size={12} className="text-white" />
            {completedCount}/{tasks.length} Done
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                task.completed
                  ? "bg-indigo-500/5 border-indigo-500/15 opacity-60"
                  : "bg-white/5 hover:bg-white/10 border-white/10 hover:scale-101 shadow-sm"
              }`}
            >
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  task.completed
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-white/20 bg-transparent hover:border-white/40"
                }`}
              >
                {task.completed && <Check size={11} strokeWidth={3} />}
              </button>

              <div className="flex-1 min-w-0" onClick={() => handleToggleTask(task.id)}>
                <span className={`block text-xs font-medium text-white truncate transition-all ${task.completed ? "line-through text-white/40" : ""}`}>
                  {task.title}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
                  <span className="h-1 w-1 bg-white/20 rounded-full" />
                  {task.category} • {task.duration}
                </span>
              </div>

              {/* Delete Custom Task button */}
              {task.id.startsWith("custom-") && (
                <button
                  onClick={() => handleRemoveTask(task.id)}
                  className="text-white/40 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add custom routine form trigger */}
        <div className="mt-4 pt-1">
          {showAddTask ? (
            <form onSubmit={handleAddTask} className="flex gap-2 mt-2">
              <input
                type="text"
                required
                placeholder="e.g. Drink chamomile tea..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white font-semibold rounded-xl px-3.5 py-1.5 text-xs hover:bg-indigo-400 cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="bg-white/5 hover:bg-white/10 text-white/70 rounded-xl px-2.5 py-1.5 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-2.5 border border-dashed border-white/20 hover:border-white/40 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Personal Routine Exercise
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
