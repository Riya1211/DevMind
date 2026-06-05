import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB.js";
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from './routes/auth.js'
import entryRoutes from "./routes/entry.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json()); // lets us read req.body as JSON

app.use(cors());

// Test route — just to check server is running
app.get("/", (req, res) => {
  res.json({ message: "DevMind API is running 🚀" });
});

// route
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

// Error middleware — always last
app.use(errorMiddleware);

// Connect DB
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});