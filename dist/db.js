"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const myConnectionString = process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.URL;
exports.client = new pg_1.Client({
    connectionString: myConnectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});
