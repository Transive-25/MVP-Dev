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
const SECRET = process.env.JWT_SECRET;


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, phone_number, time_zone = "" } = req.body;

    // check if email exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if (existing.rows.length > 0) {
      const user = existing.rows[0];

      if (user.is_verified) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // if not verified, update verification code
      await db.query(
        `UPDATE users 
         SET verification_code = $1, verification_code_expiration = $2
         WHERE email = $3`,
        [verificationCode, expiration, email]
      );

      // TODO: re-send verification email/SMS
      console.log("Resent verification code:", verificationCode);

      return res.status(200).json({ message: "Verification code resent." });
    }

    // otherwise create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

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

router.patch("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existing.rows[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await db.query(
      `UPDATE users 
       SET verification_code = $1, verification_code_expiration = $2
       WHERE email = $3`,
      [verificationCode, expiration, email]
    );

    // TODO: send code via email/SMS
    console.log("Resent verification code:", verificationCode);

    res.status(200).json({ message: "Verification code resent." });
  } catch (err) {
    console.error("Resend verification error:", err);
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
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ type: "emai", message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ type: "password", message: "Invalid password" });
    }

    // ✋ Check if student is not verified
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Email not verified. Please verify your account to continue.",
        status: "verification",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phone_number: user.phone_number,
        time_zone: user.time_zone,
        uid: user.uid,
        role: user.role,
      },
      SECRET,
      { expiresIn: '1d' },
    );

    res.json({
      user: user.email,
      accessToken: token,
      status: "success",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// REFRESH
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    res.json({ accessToken });
  });
});


// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export default router;
