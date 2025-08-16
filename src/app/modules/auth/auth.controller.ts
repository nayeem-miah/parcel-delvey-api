import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "./auth.service";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthService.credentialLogin(req.body);

    //  set jwt token ---cookie

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "user login success ✅",
        data: result
    })
});


export const AuthController = {
    credentialLogin,
}