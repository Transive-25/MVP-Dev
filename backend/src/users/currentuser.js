import express from "express";
import bcrypt from "bcrypt";
import db from "../server/server.js";
import { generateResetToken } from "../utils/helper.js";

const router = express.Router();

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      // Do not reveal if email exists for security
      return res.json({ message: "If that email exists, reset instructions were sent." });
    }

    const resetToken = generateResetToken();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expiration = $2 WHERE email = $3",
      [resetToken, expiration, email]
    );

    // TODO: send email with reset link
    console.log(`Password reset link: https://yourapp.com/reset-password?token=${resetToken}&email=${email}`);

    res.json({ message: "If that email exists, reset instructions were sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Invalid or expired token" });

    const user = result.rows[0];

    if (
      !user.reset_password_token ||
      user.reset_password_token !== token ||
      new Date() > new Date(user.reset_password_expiration)
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiration = NULL WHERE email = $2",
      [hashedPassword, email]
    );

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
