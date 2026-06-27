import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for signups to track live conversion metric
interface Signup {
  id: string;
  name: string;
  email: string;
  goal: string;
  timestamp: string;
  waitlistRank: number;
}

const signups: Signup[] = [
  { id: "1", name: "Sarah K.", email: "sarah***@gmail.com", goal: "Reduce Anxiety", timestamp: "2 mins ago", waitlistRank: 14210 },
  { id: "2", name: "David M.", email: "david***@yahoo.com", goal: "Improve Focus", timestamp: "5 mins ago", waitlistRank: 14211 },
  { id: "3", name: "Aria L.", email: "aria***@outlook.com", goal: "Better Sleep", timestamp: "12 mins ago", waitlistRank: 14212 },
  { id: "4", name: "Marcus T.", email: "marcus***@gmail.com", goal: "Build Mindfulness", timestamp: "18 mins ago", waitlistRank: 14213 },
];

let nextWaitlistRank = 14214;

// Initialize Gemini Client Lazily & Safely
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. The app will fall back to curated affirmations.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST Endpoints
app.get("/api/signups/count", (req, res) => {
  res.json({ count: nextWaitlistRank });
});

app.get("/api/signups/recent", (req, res) => {
  res.json({ signups: signups.slice(0, 8) });
});

app.post("/api/signups", (req, res) => {
  const { name, email, goal } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const newRank = nextWaitlistRank++;
  const newSignup: Signup = {
    id: String(signups.length + 1),
    name: name.trim(),
    email: email.trim().replace(/(?<=.{2}).(?=[^@]*?@)/g, "*"), // simple masking
    goal: goal || "Explore",
    timestamp: "Just now",
    waitlistRank: newRank,
  };

  // Insert at the beginning
  signups.unshift(newSignup);
  res.status(201).json({
    message: "Successfully signed up!",
    signup: newSignup,
    totalCount: newRank,
  });
});

// AI Affirmation Generation
app.post("/api/generate-affirmation", async (req, res) => {
  const { mood, notes } = req.body;
  if (!mood) {
    return res.status(400).json({ error: "Mood is required." });
  }

  const client = getAiClient();
  
  if (!client) {
    // Elegant curated fallback responses based on mood
    const fallbacks: Record<string, { affirmation: string; grounding: string }> = {
      Anxious: {
        affirmation: "I am safe in this present moment. Breathing in, I welcome calm; breathing out, I release what I cannot control.",
        grounding: "Look around you and name 3 blue things, then trace your index finger around the perimeter of your phone slowly."
      },
      Sad: {
        affirmation: "It is okay to not feel okay. I treat myself with deep gentleness and honor the weather of my emotions.",
        grounding: "Place a hand over your heart, feel its rhythmic beat, and take two slow, double-inhales through your nose."
      },
      Calm: {
        affirmation: "My mind is clear, peaceful, and anchored. I move through my day with effortless grace and spacious attention.",
        grounding: "Notice the sensation of gravity holding you right now, appreciating the quiet strength of your posture."
      },
      Energetic: {
        affirmation: "I welcome this vibrant flow of vitality. I channel my creative focus into positive, intentional actions.",
        grounding: "Stretch your arms high overhead, take a full lung-expanding breath, and release it with an audible sigh."
      },
      Tired: {
        affirmation: "I give myself permission to rest. Recharging my spirit is a necessary act of courage and self-care.",
        grounding: "Close your eyes for 30 seconds and let your jaw soften, releasing any tension behind your eyes."
      }
    };

    const key = (mood as string) || "Anxious";
    const selected = fallbacks[key] || fallbacks.Anxious;
    return res.json({
      affirmation: selected.affirmation,
      grounding: selected.grounding,
      isDemo: true,
    });
  }

  try {
    const prompt = `Generate an empathetic, short daily affirmation and a practical 1-sentence physical grounding activity for a user whose current state of mind is "${mood}". ${notes ? `The user also shared: "${notes}"` : ""}. 

Format the response in JSON with two keys:
1. "affirmation" (a beautiful, empowering, warm 1-2 sentence therapeutic affirmation)
2. "grounding" (a highly actionable 1-sentence physical grounding exercise like a breath pattern, touch focus, or sensory awareness exercise)

Make it sound incredibly human, gentle, and modern. Do not use generic cliches. Keep it highly therapeutic.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic, world-class mental health guide, therapist, and clinical psychologist. You write short, powerful, calming affirmations and grounding techniques to help people manage their state of mind in real-time.",
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }

    const result = JSON.parse(text);
    return res.json({
      affirmation: result.affirmation || "I am grounded and present in my body.",
      grounding: result.grounding || "Inhale for 4 seconds, hold for 4, and exhale for 4.",
      isDemo: false,
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return res.status(500).json({
      error: "Failed to generate affirmation via AI.",
      fallback: {
        affirmation: "I anchor myself in this present breath, acknowledging my strength.",
        grounding: "Locate five separate textured objects in your immediate environment and touch them."
      }
    });
  }
});

// Setup Vite Dev Middleware or Serve Production Build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
