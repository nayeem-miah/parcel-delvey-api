import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { User } from "./user.model";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await User.create(req.body)

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