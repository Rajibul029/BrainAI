
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Chat Model
export const chatModel = "gemini-3.5-flash";

// Embedding Model
export const embeddingModel = "gemini-embedding-001";

// Export Client
export default ai;