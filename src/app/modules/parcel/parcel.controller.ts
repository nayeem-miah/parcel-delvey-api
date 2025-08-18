import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { generateTrackingId } from "../../utils/trackingId";
import { calculateFrr } from "../../utils/calculateFee";
import { IStatusLog, ParcelStatus } from "./parcel.interface";


const createParcel = catchAsync(async (req: Request, res: Response) => {

    const decodeToken = req.user

    const trackingId = generateTrackingId();

    const totalFrr = calculateFrr(req.body.weight as number);

    const initialStatusLog: IStatusLog = {
        status: ParcelStatus.REQUESTED,
        timestamp: new Date(),
        updatedBy: decodeToken.role || "SENDER",
    };
    const payload = {
        ...req.body,
        tracking_id: trackingId,
        currentStatus: ParcelStatus.REQUESTED,
        fee: totalFrr,
        statusLogs: [initialStatusLog]
    }


    const result = await ParcelService.createParcel(payload)

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Parcel create success ✅",
        data: result.parcel
    })

    // 
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const decodeToken = req.user

    const result = await ParcelService.cancelParcel(id, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Parcel cancel success ✅",
        data: result.UpdatedCancelled
    })
})














export const ParcelController = {
    createParcel,
    cancelParcel
}