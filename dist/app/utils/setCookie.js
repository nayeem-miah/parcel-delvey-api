"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCookie = void 0;
const AuthCookie = (res, userInfo) => {
    if (userInfo.accessToken) {
        res.cookie("accessToken", userInfo.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
    }
};
exports.AuthCookie = AuthCookie;
