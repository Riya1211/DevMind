import { model } from "../utils/gemini.js";
import Entry from "../models/Entry.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";

export const summariseEntry = TryCatch(async (req, res, next) => {
  const { entryId } = req.body;

  // 1. Get the entry from DB
  const entry = await Entry.findById(entryId);
  if (!entry) return next(new ErrorHandler("Entry not found", 404));

  // 2. Build the prompt
  const prompt = `
    You are a helpful assistant for a developer journal app.
    
    A developer wrote this journal entry:
    Title: ${entry.title}
    Content: ${entry.content.replace(/<[^>]*>/g, "")}
    
    Write a short 2-3 sentence summary of what they learned.
    Be specific, mention the actual concepts they wrote about.
    Write in second person (you learned...).
    Keep it encouraging but honest.
  `;
//&lt; Represents < (start of an HTML tag), [^&gt;]*Matches anything except >, repeated any number of times, &gt;Represents > (end of an HTML tag), g Global flag → replace all matches, not just the first
  // 3. Call Gemini
  const result = await model.generateContent(prompt);
  const summary = result.response.text();

  // 4. Send back
  return res.status(200).json({
    success: true,
    summary,
  });
});