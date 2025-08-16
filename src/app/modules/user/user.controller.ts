import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { User } from "./user.model";


const createUser = catchAsync(async (req: Request, res: Response) => {

    await User.create(req.body)

    res.status(200).json({
        success: true,
        message: "user created success"
    })
})






export const UserController = {
    createUser
}