import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import http from "http";
import authRoutes from "./auth/authentication.js";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
