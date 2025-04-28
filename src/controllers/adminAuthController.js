const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Admin JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Admin Register
exports.registerAdmin = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const existing = await Admin.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ message: "Mobile already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      mobile,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const token = generateToken(newAdmin._id);
    res
      .status(201)
      .json({ token, admin: { ...newAdmin.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required." });
    }

    const admin = await Admin.findOne({ mobile });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken(admin._id);
    res.json({ token, admin: { ...admin.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
