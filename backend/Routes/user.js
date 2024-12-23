import { Router } from "express";
import User from "../Models/User.js";
import { generateToken } from "../helper/generateToken.js";
import jsonWeb from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

const router = Router();

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = await User.findOne({ email: username });
    }
    if (!user) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    } else {
      const token = await generateToken(user._id);
      console.log(token);
      return res.json({ success: true, token, user, message: "Logged In Successfully" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

// Register Route
router.post("/register", async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;  // Update password with hashed value

    const user = await User.create(req.body);
    if (user) {
      const token = await generateToken(user._id);
      console.log(token);
      return res.json({ success: true, message: "User Created", user, token });
    } else {
      return res.json({ success: false, message: "User Creation Error" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Internal error" });
  }
});

// Get User Data (Authenticated)
router.get('/me', async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = jsonWeb.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);

    if (user) {
      return res.json({ user, success: true, message: "User Found" });
    } else {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
