import { Response } from "express";

interface authToken {
    accessToken: string;
}


export const AuthCookie = (res: Response, userInfo: authToken) => {

    if (userInfo.accessToken) {
        res.cookie("accessToken", userInfo.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ?
                "none" : "lax",
        });
    }
}