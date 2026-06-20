import express from "express";
import { summariseEntry, tagEntry } from "../controllers/ai.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/summarise", summariseEntry);
router.post("/tagEntry", tagEntry);

export default router;