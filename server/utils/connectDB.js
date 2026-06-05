import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const c = await mongoose.connect(uri, { dbName: "devmind" });
    console.log(`DB Connected to ${c.connection.host}`);
  } catch (error) {
    console.log("DB Connection failed:", error);
    process.exit(1); // stop server if DB fails
  }
};