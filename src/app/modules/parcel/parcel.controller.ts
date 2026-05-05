import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ParcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { generateTrackingId } from "../../utils/trackingId";
import { calculateFrr } from "../../utils/calculateFee";
import { ParcelStatus } from "./parcel.interface";
import prisma from "../../utils/prisma";
import { initialStatusLog } from "../../utils/statusLog";
import AppError from "../../utils/AppError";

const createParcel = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as any;
    
    const user = await prisma.user.findUnique({
        where: { email: decodeToken.email }
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!user.address || user.address.length === 0) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Please update your profile address before creating a parcel");
    }

    const trackingId = generateTrackingId();
    const totalFee = calculateFrr(req.body.weight as number);

    const { sender, receiver, ...rest } = req.body;

    const payload = {
        ...rest,
        senderId: sender,
        receiverId: receiver,
        tracking_id: trackingId,
        currentStatus: ParcelStatus.REQUESTED,
        fee: totalFee,
        statusLogs: [initialStatusLog(user.role as any, req.body.note)]
    };

    const result = await ParcelService.createParcel(payload);

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Parcel created successfully ✅",
        data: result
    });
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const decodeToken = req.user as any;
    const { note } = req.body;

    const result = await ParcelService.cancelParcel(id, decodeToken, note || "Parcel cancelled");

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Parcel cancelled successfully ✅",
        data: result
    });
});

const allParcel = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodeToken = req.user as any;

    const result = await ParcelService.allParcel(query as Record<string, string>, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Sender parcels retrieved successfully ✅",
        data: result.data,
        meta: result.meta
    });
});

const getAllParcelByAdmin = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const decodeToken = req.user as any;

    const result = await ParcelService.getAllParcelByAdmin(query as Record<string, string>, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All parcels retrieved successfully ✅",
        data: result.data,
        meta: result.meta
    });
});

const updateIsBlocked = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const decodeToken = req.user as any;

    const result = await ParcelService.updateIsBlocked(id, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Parcel is ${result.isBlocked ? 'Blocked' : "unBlocked"} successfully ✅`,
        data: result
    });
});

const updateCurrentStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const decodeToken = req.user as any;
    const { note } = req.body;

    const result = await ParcelService.updateCurrentStatus(id, decodeToken, note || "Parcel status updated");

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Parcel status updated to ${result?.currentStatus} successfully ✅`,
        data: result
    });
});

const incomingParcel = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as any;

    const result = await ParcelService.incomingParcel(decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Incoming parcels retrieved successfully ✅`,
        data: result.incoming,
        meta: result.meta
    });
});

const confirmCurrentStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const decodeToken = req.user as any;

    const result = await ParcelService.confirmCurrentStatus(id, decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Parcel delivered successfully ✅`,
        data: result
    });
});

const deliveryHistory = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as any;

    const result = await ParcelService.deliveryHistory(decodeToken);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Delivery history retrieved successfully ✅`,
        data: result
    });
});

const achievement = catchAsync(async (req: Request, res: Response) => {
    const result = await ParcelService.achievement();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Achievement stats retrieved successfully ✅`,
        data: result
    });
});

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
};