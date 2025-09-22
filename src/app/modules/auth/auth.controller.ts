import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";
import { AuthCookie } from "../../utils/setCookie";

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


export const AuthController = {
    credentialLogin,
    logout
}