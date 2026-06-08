import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/connectDB.js";
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from './routes/auth.js'
import entryRoutes from "./routes/entry.js";
import aiRoutes from "./routes/ai.js"

// dotenv.config();    ← runs too late, gemini already loaded that is why we will loaded this way before anything Hoisted Problem

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json()); // lets us read req.body as JSON

app.use(cors());

// Test route
// app.get("/", (req, res) => {
//   res.json({ message: "DevMind API is running 🚀" });
// });

// route
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/ai", aiRoutes);

// Error middleware — always last
app.use(errorMiddleware);

// Connect DB
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});