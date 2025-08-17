import { Response } from "express";
import { envVars } from "../config/env"

interface authToken {
    accessToken: string;
}


export const AuthCookie = (res: Response, userInfo: authToken) => {

    if (userInfo.accessToken) {
        res.cookie("accessToken", userInfo.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV === "production",
            sameSite: "none"
        })
    }
}