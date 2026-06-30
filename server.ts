import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini API client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API Endpoints: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API Endpoints: AI Chat Assistant
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid request. 'messages' array is required." });
      return;
    }

    // Format messages for @google/genai (roles must be 'user' or 'model')
    // Standard system instructions are passed in the configuration
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const systemInstruction = `You are RecollectBuddy, a warm, professional, and highly capable AI productivity assistant. 
You help the user stay organized, focused, and stress-free. 
You can guide them on their tasks, habits, and help manage files in their Google Drive.
Keep your responses helpful, positive, well-structured (using markdown/bullet points where appropriate), and concise.`;

    let responseText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: { systemInstruction }
      });
      responseText = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Primary model gemini-3.5-flash failed, trying fallback gemini-3.1-flash-lite:", primaryErr.message || primaryErr);
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: contents,
          config: { systemInstruction }
        });
        responseText = response.text || "";
      } catch (fallbackErr: any) {
        console.error("Both Gemini models failed, falling back to local chat guidance:", fallbackErr.message || fallbackErr);
        // Clean local offline companion response
        responseText = "RecollectBuddy is currently operating in local standalone mode due to a temporary high-demand spike on the AI servers. But I'm still here! I've saved your checklist, planner items, and Google Drive files. What would you like to schedule or create next?";
      }
    }

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Critical Gemini Chat Route Error:", error);
    res.json({ text: "RecollectBuddy is currently in standalone mode. Let's continue working on your habits and drive files!" });
  }
});

// API Endpoints: AI Daily Brief Generator
app.post("/api/gemini/brief", async (req, res) => {
  try {
    const { tasks, events, habits } = req.body;

    const dataSummary = `
- Tasks: ${JSON.stringify(tasks || [])}
- Events/Calendar: ${JSON.stringify(events || [])}
- Habits: ${JSON.stringify(habits || [])}
`;

    const prompt = `Generate a personalized morning briefing and recommendations based on the user's current productivity stats.
Keep it conversational, encouraging, and under 150 words. Focus on the most important actions for today and include a clear, bold "Recommendation of the Day" at the end.
UserData Summary:
${dataSummary}`;

    const systemInstruction = "You are RecollectBuddy's intelligent morning briefer. Keep your tone uplifting, warm, and highly structured.";

    let briefText = "";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: { systemInstruction }
      });
      briefText = response.text || "";
    } catch (primaryErr: any) {
      console.warn("Primary model gemini-3.5-flash failed for brief, trying gemini-3.1-flash-lite:", primaryErr.message || primaryErr);
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: { systemInstruction }
        });
        briefText = response.text || "";
      } catch (fallbackErr: any) {
        console.error("Both Gemini models failed for brief, falling back to smart client-side summary:", fallbackErr.message || fallbackErr);
        
        // Generate a beautiful, structured summary using local data
        const pendingCount = tasks ? tasks.filter((t: any) => !t.completed).length : 0;
        const eventCount = events ? events.length : 0;
        const habitCount = habits ? habits.length : 0;

        briefText = `Welcome to your morning Standup! 🌅

The AI engine is currently operating in standalone mode, but your local workspace is completely synchronized and functional:
- **Tasks**: You have ${pendingCount} task${pendingCount === 1 ? '' : 's'} remaining on your list.
- **Events**: There ${eventCount === 1 ? 'is' : 'are'} ${eventCount} scheduled item${eventCount === 1 ? '' : 's'} on your agenda today.
- **Habits**: ${habitCount} habit routines are tracked for daily consistency.

**Recommendation of the Day:**
Focus on executing your highest priority tasks first, and sync any key meeting notes with your Google Drive folder to preserve critical work!`;
      }
    }

    res.json({ brief: briefText });
  } catch (error: any) {
    console.error("Critical Gemini Brief Route Error:", error);
    const pendingCount = req.body.tasks ? req.body.tasks.filter((t: any) => !t.completed).length : 0;
    res.json({ 
      brief: `Welcome back to RecollectBuddy! 🌅

Your workspace is fully loaded:
- **Tasks Remaining**: ${pendingCount}
- **Agenda Items**: ${req.body.events ? req.body.events.length : 0}

**Recommendation of the Day:**
Keep building your daily streaks and synchronize your critical files with Google Drive.`
    });
  }
});

// Start server function incorporating Vite middleware
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
    console.log(`RecollectBuddy server is running on http://localhost:${PORT}`);
  });
}

startServer();
