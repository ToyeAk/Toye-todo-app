import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const myConnectionString =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.URL;

export const client = new Client({
  connectionString: myConnectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});
