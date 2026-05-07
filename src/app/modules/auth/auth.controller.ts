import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import { AuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/useToken";
import { envVars } from "../../config/env";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {

    const userInfo = await AuthService.credentialLogin(req.body);
    AuthCookie(res, userInfo)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Login successfully",
        data: userInfo
    })
});
const logout = catchAsync(async (req: Request, res: Response) => {

    const isProduction = envVars.NODE_ENV === "production" || process.env.VERCEL === "1";

    // clear cookie jwt token
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    })




    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Logout successfully",
        data: null
    })
});

const googleCallbackControllers = async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? req.query.state as string : "";

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice()
    }
    const user = req.user;

    // console.log("google login user", user);

    if (!user) {
        throw new Error("user not found");
    }
    const tokenInfo = createUserToken(user)

    AuthCookie(res, { accessToken: tokenInfo })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
}

export const AuthController = {
    credentialLogin,
    logout,
    googleCallbackControllers
}