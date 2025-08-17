import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


const createParcel = catchAsync(async (req: Request, res: Response) => {

    const result = await ParcelService.createParcel(req.body)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Parcel create success ✅",
        data: result
    })

    // 
})














export const ParcelController = {
    createParcel
}