import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const connection = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // for free-tier or self-signed certs
  },
});

connection
  .connect()
  .then(() => console.log("✅ DATABASE CONNECTED"))
  .catch((err) => console.error("❌ Connection error", err.stack));

export default connection;
