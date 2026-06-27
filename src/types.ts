export interface SignupUser {
  id: string;
  name: string;
  email: string;
  goal: string;
  timestamp: string;
  waitlistRank: number;
}

export type MoodType = "Anxious" | "Sad" | "Calm" | "Energetic" | "Tired";

export interface AffirmationResult {
  affirmation: string;
  grounding: string;
  isDemo?: boolean;
}

export interface MentalTask {
  id: string;
  title: string;
  duration: string;
  category: "Meditation" | "Breathing" | "Grounding" | "Reflection";
  completed: boolean;
}
