// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const Vendor = require("../models/Vendor");

// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // Register
// exports.register = async (req, res) => {
//   try {
//     const { name, mobile, password, role } = req.body;

//     if (!name || !mobile || !password || !role)
//       return res.status(400).json({ message: "All fields required." });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const Model = role === "user" ? User : Vendor;
//     const existing = await Model.findOne({ mobile });

//     if (existing)
//       return res.status(400).json({ message: "Mobile already exists." });

//     const newUser = new Model({ name, mobile, password: hashedPassword });
//     await newUser.save();

//     const token = generateToken(newUser._id, role);
//     res.status(201).json({ token, user: newUser });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Login
// exports.login = async (req, res) => {
//   try {
//     const { mobile, password, role } = req.body;
//     if (!mobile || !password || !role)
//       return res.status(400).json({ message: "All fields required." });

//     const Model = role === "user" ? User : Vendor;
//     const user = await Model.findOne({ mobile });

//     if (!user) return res.status(404).json({ message: "User not found." });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials." });

//     const token = generateToken(user._id, role);
//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { name, mobile, password, role, location } = req.body;

    if (!name || !mobile || !password || !role) {
      return res.status(400).json({ message: "All fields required." });
    }

    const Model = role === "user" ? User : Vendor;
    const existing = await Model.findOne({ mobile });

    if (existing) {
      return res.status(400).json({ message: "Mobile already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Model({
      name,
      mobile,
      password: hashedPassword,
      ...(location && { location }), // Only include location if provided
    });

    await newUser.save();

    const token = generateToken(newUser._id, role);
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { mobile, password, role } = req.body;

    if (!mobile || !password || !role) {
      return res.status(400).json({ message: "All fields required." });
    }

    const Model = role === "user" ? User : Vendor;
    const user = await Model.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user._id, role);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
