import dotenv from "dotenv";

dotenv.config();

const password = process.env.PASSWORD;
const database = process.env.DATABASE;

const config = {
  port: 5000,
  secret: process.env.JWT_SECRET || "ay+5M9*85&B8W*zp",
  mongoUri: "mongodb://localhost:27017/eventManager",
};

export default config;
