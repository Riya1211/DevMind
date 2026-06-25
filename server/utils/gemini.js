// initialises the Gemini client and reuses it
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
export const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });