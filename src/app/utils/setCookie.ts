import { Response } from "express";

interface authToken {
    accessToken: string;
}


export const AuthCookie = (res: Response, userInfo: authToken) => {

    if (userInfo.accessToken) {
        res.cookie("accessToken", userInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
    }
}