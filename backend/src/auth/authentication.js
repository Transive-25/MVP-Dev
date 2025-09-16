import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../server/server.js"; // your pg client
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, phone_number, time_zone = "" } = req.body;

    // check if email exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await db.query(
      `INSERT INTO users 
        (uid, full_name, email, password, phone_number, time_zone, verification_code, verification_code_expiration) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        crypto.randomUUID(),
        full_name,
        email,
        hashedPassword,
        phone_number,
        time_zone,
        verificationCode,
        expiration,
      ]
    );

    // TODO: send code via email/SMS
    console.log("Verification code:", verificationCode);

    res.status(201).json({ message: "User registered. Verification code sent." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// VERIFY
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];

    if (user.is_verified) return res.status(400).json({ message: "Already verified" });

    if (user.verification_code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (new Date() > new Date(user.verification_code_expiration)) {
      return res.status(400).json({ message: "Code expired" });
    }

    await db.query(
      "UPDATE users SET is_verified = true, verification_code = NULL, verification_code_expiration = NULL WHERE email = $1",
      [email]
    );

    res.json({ message: "Verification successful" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];

    if (!user.is_verified) return res.status(401).json({ message: "Account not verified" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { uid: user.uid, email: user.email };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// REFRESH
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const payload = { uid: user.uid, email: user.email };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export default router;
