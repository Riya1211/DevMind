import Entry from "../models/Entry.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";

// CREATE entry
export const createEntry = TryCatch(async (req, res, next) => {
  const { title, content, tags, mood, type } = req.body;

  if (!title) {
    return next(new ErrorHandler("Title is required", 400));
  }

  const entry = await Entry.create({
    title,
    content,
    tags,
    mood,
    type,
    user: req.user._id, // from isAuthenticated middleware
  });

  return res.status(201).json({
    success: true,
    message: "Entry created",
    entry,
  });
});

// GET ALL entries for logged in user
export const getEntries = TryCatch(async (req, res, next) => {
  const entries = await Entry.find({ user: req.user._id }).sort({
    createdAt: -1,
  }); // newest first

  return res.status(200).json({
    success: true,
    entries,
  });
});

// GET single entry
export const getEntry = TryCatch(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);

  if (!entry) {
    return next(new ErrorHandler("Entry not found", 404));
  }

  // make sure entry belongs to logged in user
  if (entry.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  return res.status(200).json({
    success: true,
    entry,
  });
});

// DELETE entry
export const deleteEntry = TryCatch(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);

  if (!entry) {
    return next(new ErrorHandler("Entry not found", 404));
  }

  if (entry.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  await entry.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Entry deleted",
  });
});

// UPDATE entry
export const updateEntry = TryCatch(async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);

  if (!entry) {
    return next(new ErrorHandler("Entry not found", 404));
  }

  if (entry.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  const updated = await Entry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }, // return updated doc not old one
  );

  return res.status(200).json({
    success: true,
    message: "Entry updated",
    entry: updated,
  });
});

// get All Tags
export const getAllTags = TryCatch(async (req, res, next) => {
  const entries = await Entry.find({ user: req.user._id });
  
  // get all unique tags across all entries
  const allTags = [...new Set(entries.flatMap(e => e.tags))];

  return res.status(200).json({
    success: true,
    tags: allTags,
  });
});

//Get Stats
export const getStats = TryCatch(async (req, res, next) => {
  const userId = req.user._id;

  // get all entries for this user
  const entries = await Entry.find({ user: userId });

  // total entries
  const totalEntries = entries.length;

  // unique skills from all tags combined
  const skills = [...new Set(entries.flatMap((e) => e.tags))];

  // calculate streak and best streak
  const { current, best } = calculateStreak(entries);

  return res.status(200).json({
    success: true,
    stats: {
      totalEntries,
      currentStreak: current,
      bestStreak: best,
      skills, // feeds skills logged card
      aiSummaries: 0, // will update in Phase 2
    },
  });
});

// Helper — calculates current streak from entry dates
function calculateStreak(entries) {
  if (entries.length === 0) return 0;

  //Get unique dates as strings
  const dates = [
    ...new Set(entries.map((e) => new Date(e.createdAt).toDateString())),
  ]
    .map((d) => new Date(d))
    .sort((a, b) => b - a);
  //  Convert back to Date objects and sort newest first

  // --- CURRENT STREAK ---
  let current = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current++;
    } else {
      break;
    }
  }

  // --- BEST STREAK ---
  // go through ALL dates
  let best = 1;
  let tempStreak = 1;

  for (let i = 0; i < dates.length - 1; i++) {
    const diff = (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      tempStreak++;
      if (tempStreak > best) best = tempStreak; 
    } else {
      tempStreak = 1; // reset temp but keep best
    }
  }

  return { current, best };
}
