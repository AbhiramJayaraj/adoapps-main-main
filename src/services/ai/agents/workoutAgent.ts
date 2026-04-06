import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMockUserProfile } from "../../firebase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "DUMMY_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export class WorkoutAgent {
  static async generateCorrectionFeedback(exerciseName: string, postureErrorCode: string) {
    if (API_KEY === "DUMMY_KEY") return "Keep your back straight.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const profile = getMockUserProfile();
    
    // Quick concise prompting for live feedback
    const prompt = `
      You are the Pocket AI Trainer. 
      User is doing ${exerciseName}. 
      MediaPipe tracking reports: ${postureErrorCode}.
      Health Mode: ${profile.healthMode}.

      Generate a short, encouraging verbal instruction (under 10 words) to correct their posture immediately. 
      Ensure it feels like a real trainer talking but be extremely brief. Do not include quotes or extra text.
    `;
    
    try {
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error("Failed to generate workout feedback:", error);
      return "Check your posture.";
    }
  }
}
