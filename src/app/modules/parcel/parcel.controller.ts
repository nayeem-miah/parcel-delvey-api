import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { generateTrackingId } from "../../utils/trackingId";
import { calculateFrr } from "../../utils/calculateFee";
import { ParcelStatus } from "./parcel.interface";
import { User } from "../user/user.model";
import { initialStatusLog } from "../../utils/statusLog";

//  sender parcel
const createParcel = catchAsync(async (req: Request, res: Response) => {

    const decodeToken = req.user
    // find user 
    const isExistUSer = await User.findOne({ email: decodeToken.email });

    if (!(isExistUSer?.address && isExistUSer.address.length > 0)) {
        throw new Error("please update your profile address ")
    }

    const trackingId = generateTrackingId();

    const totalFrr = calculateFrr(req.body.weight as number);


    const payload = {
        ...req.body,
        tracking_id: trackingId,
        currentStatus: ParcelStatus.REQUESTED,
        fee: totalFrr,
        statusLogs: [initialStatusLog(isExistUSer.role, req.body.note)]
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
    const decodeToken = req.user;
    const { note } = req.body || "parcel canceled"

    const result = await ParcelService.cancelParcel(id, decodeToken, note);

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

//  admin parcel
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
        message: `this parcel is ${result.updateData.isBlocked ? 'Blocked' : "unBlocked"} success✅`,
        data: result.updateData,
        // meta: result.meta
    })
})

const updateCurrentStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const decodeToken = req.user
    const { note } = req.body || "parcel current status updated"

    const result = await ParcelService.updateCurrentStatus(id, decodeToken, note);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `parcel current status  ${result.updateData?.currentStatus} success✅`,
        data: result.updateData,
        // meta: result.meta
    })
})

// Receiver parcel
const incomingParcel = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user

    const result = await ParcelService.incomingParcel(decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `parcel received success✅`,
        data: result.incoming,
        meta: {
            total: result.meta.total,
            limit: result.meta.limit,
            page: result.meta.page,
            totalPage: result.meta.page
        }
    })
})

const confirmCurrentStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const decodeToken = req.user

    const result = await ParcelService.confirmCurrentStatus(id, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `parcel DELIVERED success✅`,
        data: result.confirmStatus,

    })
})

const deliveryHistory = catchAsync(async (req: Request, res: Response) => {

    const decodeToken = req.user

    const result = await ParcelService.deliveryHistory(decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `all delivery history received success✅`,
        data: result.parcel,

    })
})
const achievement = catchAsync(async (req: Request, res: Response) => {

    const result = await ParcelService.achievement();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `all delivery history received success✅`,
        data: result,

    })
})




export const ParcelController = {
    createParcel,
    cancelParcel,
    allParcel,
    getAllParcelByAdmin,
    updateIsBlocked,
    updateCurrentStatus,
    incomingParcel,
    confirmCurrentStatus,
    deliveryHistory,
    achievement
}