import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMockUserProfile } from "../firebase";

// In production, use securely stored API key from env or via backend proxy
// We fallback to a dummy key to prevent crash if not set, but it will fail on real call
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "DUMMY_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiOrchestrator {
  static async resolveIntent(userText: string) {
    if (API_KEY === "DUMMY_KEY") return { intent: "unknown", message: "API Key missing." };
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const profile = getMockUserProfile();
    
    const prompt = `
      You are the AI Orchestrator for a health app.
      User Profile: ${JSON.stringify(profile)}
      User input: "${userText}"
      
      Determine the intent of the user. Is it:
      - "log_diet": they want to log food or ask about a meal.
      - "start_workout": they want to exercise.
      - "health_advice": general questions.
      - "unknown": anything else.
      
      Respond in strictly JSON: { "intent": string, "rationale": string }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Simple parse assume it's clean json
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return parsed;
    } catch (error) {
      console.error("Failed to resolve intent:", error);
      return { intent: "error", message: "Failed logic" };
    }
  }
}
