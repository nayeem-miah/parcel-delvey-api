import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { generateTrackingId } from "../../utils/trackingId";
import { calculateFrr } from "../../utils/calculateFee";
import { IStatusLog, ParcelStatus } from "./parcel.interface";
import { User } from "../user/user.model";


const createParcel = catchAsync(async (req: Request, res: Response) => {

    const decodeToken = req.user
    // find user 
    const isExistUSer = await User.findOne({ email: decodeToken.email });

    if (!(isExistUSer?.address && isExistUSer.address.length > 0)) {
        throw new Error("please update your profile address ")
    }

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

const allParcel = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodeToken = req.user

    const result = await ParcelService.allParcel(query as Record<string, string>, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Sender Parcel retrieved success ✅",
        data: result.data,
        meta: result.meta
    })
})


const getAllParcelByAdmin = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodeToken = req.user

    const result = await ParcelService.getAllParcelByAdmin(query as Record<string, string>, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Äll Parcel retrieved success ✅",
        data: result.data,
        meta: result.meta
    })
})

const updateIsBlocked = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const decodeToken = req.user

    const result = await ParcelService.updateIsBlocked(id, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "isBlocked update success success ✅",
        data: result.updateData,
        // meta: result.meta
    })
})











export const ParcelController = {
    createParcel,
    cancelParcel,
    allParcel,
    getAllParcelByAdmin,
    updateIsBlocked
}