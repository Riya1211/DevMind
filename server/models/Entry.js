import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    content: {
      type: String,
      default: "", // HTML from TipTap
    },
    tags: {
      type: [String],
      default: [],
    },
    mood: {
      type: String,
      enum: ["","😤", "🤔", "💡", "🔥"],
      default: "",
    },
    type: {
      type: String,
      enum: ["","📝 Notes", "💥 Struggle", "✨ Breakthrough", "📌 Reference"],
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // every entry must belong to a user
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Entry", entrySchema);