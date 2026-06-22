import Quiz from "../models/Quiz.js";
import Entry from "../models/Entry.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import { model } from "../utils/gemini.js";

// Generate Quiz
export const generateQuiz = TryCatch(async (req, res, next) => {
  const { entryId, mode = "single", questionCount = 3 } = req.body;

  let entries;
  let quizTitle;

  if (mode === "all") {
    entries = await Entry.find({ user: req.user._id });
    quizTitle = "All entries quiz";

    if (!entries.length) {
      return next(new ErrorHandler("You have no entries to quiz from", 400));
    }
  } else {
    // single entry mode
    if (!entryId) {
      return next(new ErrorHandler("Please provide an entryId", 400));
    }

    const entry = await Entry.findById(entryId);
    if (!entry) return next(new ErrorHandler("Entry not found", 404));

    entries = [entry];
    quizTitle = entry.title;
  }

  //combine all entries we are doing this because most llms are text based and it is cleaner and easier to understand
  const combinedContent = entries
    .map(
      (e) => `
    Title: ${e.title},
    Content: ${e.content}
    `,
    )
    .join("\n--\n");

  if (!combinedContent.trim()) {
    return next(
      new ErrorHandler("No content found to generate quiz from", 400),
    );
  }

  const prompt = `
    You are a quiz generator for a developer journal app.
    
    A developer wrote these journal entries:
    ${combinedContent}
    
    Generate exactly ${questionCount} multiple choice quiz questions
    based on the concepts covered in these entries.
    Each question must have 4 options and one correct answer.
    Make questions specific to what was actually written, not generic.
    Vary the difficulty — mix easy recall and deeper understanding questions.
    
    Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
    {
      "questions": [
        {
          "question": "question text here",
          "options": ["option A", "option B", "option C", "option D"],
          "answer": 0,
          "explanation": "brief explanation of why this is correct"
        }
      ]
    }
    
    The answer field is the INDEX of the correct option (0, 1, 2, or 3).
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // this done because models frequently wrap JSON inside Markdown code fences, while JavaScript's JSON.parse() expects only pure JSON text.
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let questions;
  try {
    const parsed = JSON.parse(cleaned);
    questions = parsed.questions;
  } catch (e) {
    return next(
      new ErrorHandler("Failed to parse quiz questions — try again", 500),
    );
  }

  return res.status(200).json({
    success: true,
    questions,
    quizTitle,
    mode,
    entryIds: entries.map((e) => e._id),
  });
});

//Save Quiz
export const saveQuiz = TryCatch(async (req, res, next) => {
  const { entryIds, mode = "single", score, total, results } = req.body;

  if (!score === undefined || !total) {
    return next(new ErrorHandler("Please provide score and total", 400));
  }

  const quiz = await Quiz.create({
    user: req.user._id,
    entries: entryIds || [],
    mode,
    score,
    total,
    results: results || [],
  });

  return res.status(201).json({
    success: true,
    message: "Quiz saved",
    quiz,
  });
});

//Show all quiz
export const getQuizHistory = TryCatch(async (req, res, next) => {
  const quizzes = await Quiz.find({ user: req.user._id })
    .populate("entries", "title") //like join in SQL
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    quizzes,
  });
});
