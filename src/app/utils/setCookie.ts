import { Response } from "express";
import { envVars } from "../config/env";


interface authToken {
    accessToken: string;
}


export const AuthCookie = (res: Response, userInfo: authToken) => {
    const isProduction = envVars.NODE_ENV === "production" || process.env.VERCEL === "1";

    if (userInfo.accessToken) {
        res.cookie("accessToken", userInfo.accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
        });
    }
}
