"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateYMD = formatDateYMD;
exports.randomDigits = randomDigits;
exports.generateTrackingId = generateTrackingId;
const crypto_1 = __importDefault(require("crypto"));
function formatDateYMD(timeZone = "Asia/Dhaka", date = new Date()) {
    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
    return ymd.replace(/-/g, "");
}
function randomDigits(n) {
    const max = 10 ** n;
    const num = crypto_1.default.randomInt(0, max);
    return num.toString().padStart(n, "0");
}
function generateTrackingId(timeZone = "Asia/Dhaka", date = new Date()) {
    const ymd = formatDateYMD(timeZone, date);
    const suffix = randomDigits(6);
    return `TRK-${ymd}-${suffix}`;
}
