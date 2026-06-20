import express from "express";
import {
  createEntry,
  getEntries,
  getEntry,
  deleteEntry,
  updateEntry,
  getStats,
  getAllTags,
} from "../controllers/entry.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// all routes here need authentication
router.use(isAuthenticated);

router.get("/stats", getStats);
router.get("/tags", getAllTags);
router.post("/", createEntry);
router.get("/", getEntries);
router.get("/:id", getEntry);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;