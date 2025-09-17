import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import http from "http";
import authRoutes from "./auth/authentication.js";
import userRoutes from "./users/currentuser.js";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
// Dynamic CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      return callback(null, true); // ✅ allow all origins dynamically
    },
    credentials: true, // ✅ allow cookies
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
