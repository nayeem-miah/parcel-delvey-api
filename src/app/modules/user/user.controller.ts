import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";


const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createUser(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: false,
        message: "user created success ✅",
        data: result
    })
})






export const UserController = {
    createUser
}