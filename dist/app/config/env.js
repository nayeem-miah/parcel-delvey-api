"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const localVariable = () => {
    const requireVariable = [
        "PORT",
        "MONGODB_URI",
        "NODE_ENV",
        "BCRYPT_SLOT_ROUND",
        "ADMIN_EMAIL",
        "ADMIN_PASS",
        "JWT_SECRET",
        "JWT_EXPIRE",
    ];
    requireVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        MONGODB_URI: process.env.MONGODB_URI,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SLOT_ROUND: process.env.BCRYPT_SLOT_ROUND,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASS: process.env.ADMIN_PASS,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRE: process.env.JWT_EXPIRE,
    };
};
exports.envVars = localVariable();
