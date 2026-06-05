import User from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../middlewares/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;

  // 1. Check all fields are provided
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already registered", 400));
  }

  // 3. Hash the password — never store plain text
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 5. Send back response — never send password
  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// LOGIN
export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check fields
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  // 2. Find user — need +password because select:false
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // 3. Compare password with hashed one in DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // 4. Create JWT token
  const token = jwt.sign(
    { _id: user._id },           // payload — what we store in token
    process.env.JWT_SECRET,       // secret key
    { expiresIn: "7d" }          // token expires in 7 days
  );

  // 5. Send token back
  return res.status(200).json({
    success: true,
    message: `Welcome, ${user.name}`,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});