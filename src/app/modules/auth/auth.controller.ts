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
    // console.log(result.accessToken);

    //  set jwt token --- in cookie
    AuthCookie(res, userInfo)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "user login success ✅",
        data: userInfo
    })
});
const logout = catchAsync(async (req: Request, res: Response) => {

    // clear cookie jwt token
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ?
            "none" : "lax",
    })


    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "user login success ✅",
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