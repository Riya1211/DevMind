import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.js";
import User from "../models/User.js";

export const isAuthenticated = TryCatch(async (req, res, next) => {
  // 1. Get token from request header
  const token = req.headers.authorization?.split(" ")[1];
  // frontend sends: "Bearer eyJhbGci..."
  // we split by space and take index [1] → just the token

  // 2. Check token exists
  if (!token) {
    return next(new ErrorHandler("Please login first", 401));
  }

  // 3. Verify token is valid and not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. Find user from token payload
  req.user = await User.findById(decoded._id);

  // 5. Pass to next middleware/controller
  next();
});
