
import crypto from "crypto";

export function formatDateYMD(timeZone = "Asia/Dhaka", date = new Date()) {

    const ymd = new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
    return ymd.replace(/-/g, "");
}

export function randomDigits(n: number) {

    const max = 10 ** n;
    const num = crypto.randomInt(0, max);
    return num.toString().padStart(n, "0");
}

export function generateTrackingId(timeZone = "Asia/Dhaka", date = new Date()) {
    const ymd = formatDateYMD(timeZone, date);
    const suffix = randomDigits(6);
    return `TRK-${ymd}-${suffix}`;
}
