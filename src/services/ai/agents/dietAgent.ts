import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMockUserProfile } from "../../firebase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "DUMMY_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export class DietAgent {
  static async analyzeFood(visionLabels: string[]) {
    if (API_KEY === "DUMMY_KEY") return null;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: { responseMimeType: "application/json" } });
    const profile = getMockUserProfile();
    
    const prompt = `
      You are the Diet Agent. The user just scanned a meal.
      User Profile: ${profile.age} years old, ${profile.weight}kg, Goal: ${profile.goals}, Health Mode: ${profile.healthMode}.
      Cloud Vision Detected Items: ${visionLabels.join(", ")}
      
      Task:
      1. Estimate the items, portion sizes, calories, and macros (protein, carbs, fats). Include Indian food variations if applicable.
      2. Evaluate glycemic load or risk factors according to their Health Mode.
      3. Suggest a brief, actionable behavioral alternative or portion advice.

      Respond in strict JSON: { 
        "meal": "string", 
        "calories": 0, 
        "macros": { "protein": 0, "carbs": 0, "fat": 0 }, 
        "healthImpact": "string", 
        "advice": "string" 
      }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to analyze food:", error);
      return null;
    }
  }
}
