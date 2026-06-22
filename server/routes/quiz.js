import express from "express";
import {
  generateQuiz,
  saveQuiz,
  getQuizHistory,
} from "../controllers/quiz.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/generate", generateQuiz);
router.post("/save", saveQuiz);
router.get("/history", getQuizHistory);

export default router;