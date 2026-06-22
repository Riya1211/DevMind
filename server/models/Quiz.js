import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const questionResultSchema = new mongoose.Schema({
  question: String,
  userAnswer: Number,
  correctAnswer: Number,
  isCorrect: Boolean,
});

const quizSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    entries: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    }],
    mode: {
      type: String,
      enum: ["single", "all"],
      default: "single",
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    results: [questionResultSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Quiz", quizSchema);