import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { UserService } from "./user.service";


const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createUser(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "user retrieve success ✅",
        data: result
    })
})

const userProfile = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user;


    const result = await UserService.userProfile(decodedToken.userId)

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "user created success ✅",
        data: result
    })
})

const allUser = catchAsync(async (req: Request, res: Response) => {


    const result = await UserService.allUser()

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "all user received success ✅",
        data: result
    })
})

const singleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params

    const result = await UserService.singleUser(id)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "user created success ✅",
        data: result
    })
})






export const UserController = {
    createUser,
    userProfile,
    allUser,
    singleUser
}