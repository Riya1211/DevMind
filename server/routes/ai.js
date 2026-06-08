import express from "express";
import { summariseEntry } from "../controllers/ai.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/summarise", summariseEntry);

export default router;