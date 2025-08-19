/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from "jsonwebtoken";
import { IParcel, IStatusLog, ParcelStatus, } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import { Role } from "../user/user.interface";
import { TMeta } from "../../utils/sendResponse";
import { User } from "../user/user.model";
import { updateStatusLogsApproved, updateStatusLogsDelivered, updateStatusLogsDispatched } from "../../utils/statusLog";

//  sender services
const createParcel = async (payload: Partial<IParcel>) => {

    const parcel = await Parcel.create(payload);
    return {
        parcel
    }

}

const cancelParcel = async (tracking_id: string, decodeToken: JwtPayload) => {

    //  find parcel by tracking_id
    const parcel = await Parcel.findOne({ tracking_id });

    if (!parcel) {
        throw new Error("parcel not found!")
    }

    //  checking parcel status
    if (parcel.currentStatus !== ParcelStatus.REQUESTED && parcel.currentStatus !== ParcelStatus.APPROVED) {
        throw new Error(`Parcel already ${parcel.currentStatus}, cannot be cancelled!`)
    };


    //  change status
    const initialStatusLog: IStatusLog = {
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: decodeToken.role || "SENDER",
        note: "receiver do not want this parcel so i can cancel this parcel"
    };

    const updateData = {
        currentStatus: ParcelStatus.CANCELLED,
        statusLogs: [initialStatusLog]

    }


    const UpdatedCancelled = await Parcel.findOneAndUpdate(
        { tracking_id },
        updateData,
        { new: true, runValidators: true }
    );

    return {
        UpdatedCancelled
    }
};

const allParcel = async (query: Record<string, string>, decodeToken: JwtPayload) => {

    if (decodeToken.role !== Role.SENDER) {
        throw new Error("You can not access this route")
    }

    //  pagination implement
    /** pagination --> ?page=30&limit=10
     * page --- 1
     * limit  --> 10
     * skip = (page-1) * limit ---> 1 st page skip --> 1-1  * 10 --> skip --> 0,
     * skip = (page-1) * limit ---> 2 st page skip --> 2-1  * 10 --> skip --> 10,
     * skip = (page-1) * limit ---> 3 st page skip --> 3-1  * 10 --> skip --> 20,
     */

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit



    const totalCountParcel = await Parcel.countDocuments({ sender: decodeToken.userId })
    const totalPage = Math.ceil(totalCountParcel / limit)
    // sender parcel find 
    const senderParcel = await Parcel.find(
        { sender: decodeToken.userId }
    )
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

    const meta: TMeta = {
        page: page,
        limit: limit,
        total: totalCountParcel,
        totalPage: totalPage
    }

    return {
        data: senderParcel,
        meta: meta
    }
}

//  admin parcel services
const getAllParcelByAdmin = async (query: Record<string, string>, decodeToken: JwtPayload) => {

    // all?filter=REQUESTED
    const filter = query.filter ? { currentStatus: query.filter } : {};



    if (decodeToken.role !== Role.ADMIN) {
        throw new Error("You can not access this route")
    }

    //  pagination
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit



    const totalCountParcel = await Parcel.countDocuments(filter)
    const totalPage = Math.ceil(totalCountParcel / limit)

    // sender parcel find 
    const senderParcel = await Parcel.find(filter)
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)

    const meta: TMeta = {
        page: page,
        limit: limit,
        total: totalCountParcel,
        totalPage: totalPage
    }

    return {
        data: senderParcel,
        meta: meta
    }
}

const updateIsBlocked = async (id: string, decodeToken: JwtPayload) => {

    const isExistUser = await User.findOne({ email: decodeToken.email });

    if (!isExistUser) {
        throw new Error("user not found !")
    }

    if (isExistUser.role !== Role.ADMIN) {
        throw new Error("You can not access this route")
    };

    const parcel = await Parcel.findById(id);
    let updateData: any;

    if (parcel?.isBlocked) {
        updateData = await Parcel.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true, runValidators: true }
        )
    } else {
        updateData = await Parcel.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true, runValidators: true }
        )
    }



    return {
        updateData
    }
}

const updateCurrentStatus = async (id: string, decodeToken: JwtPayload) => {
    if (decodeToken.role !== Role.ADMIN) {
        throw new Error("you are not authorized to access this route");
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) throw new Error("parcel not found");

    let newStatus: ParcelStatus | null = null;
    let newLog: IStatusLog | null = null;

    if (parcel.currentStatus === ParcelStatus.REQUESTED) {
        newStatus = ParcelStatus.APPROVED;
        newLog = updateStatusLogsApproved;
    } else if (parcel.currentStatus === ParcelStatus.APPROVED) {
        newStatus = ParcelStatus.DISPATCHED;
        newLog = updateStatusLogsDispatched;
    } else if (parcel.currentStatus === ParcelStatus.DISPATCHED) {
        throw new Error("Parcel already DISPATCHED");
    }

    const updateData = await Parcel.findByIdAndUpdate(
        id,
        {
            $set: { currentStatus: newStatus },
            $push: { statusLogs: newLog }
        },
        { new: true, runValidators: true }
    );

    return { updateData };
};


// Receiver parcel services
const incomingParcel = async (decodedToken: JwtPayload) => {

    const incoming = await Parcel.find({ receiver: decodedToken.userId })
        .populate("sender", "name email address phone")
        .populate("receiver", "name email address phone")

    const totalCount = await Parcel.countDocuments({ receiver: decodedToken.userId });

    const meta: TMeta = {
        total: totalCount,
        limit: 0,
        page: 0,
        totalPage: 0
    }

    return {
        incoming,
        meta
    }
}

const confirmCurrentStatus = async (id: string, decodedToken: JwtPayload) => {

    if (decodedToken.role !== Role.RECEIVER) {
        throw new Error("you are not authorized this route")
    }

    const parcel = await Parcel.findOne({ receiver: decodedToken.userId, _id: id });

    if (!parcel) {
        throw new Error("parcel not fount")
    }

    if (parcel.currentStatus !== ParcelStatus.DISPATCHED) {
        throw new Error(`Invalid status: Parcel is currently ${parcel.currentStatus}, expected DISPATCHED.`);
    };



    const confirmStatus = await Parcel.findByIdAndUpdate(
        parcel._id,
        {
            $set: { currentStatus: ParcelStatus.DELIVERED },
            $push: { statusLogs: updateStatusLogsDelivered }
        },
        { new: true, runValidators: true }
    )

    return {
        confirmStatus
    }
}

const deliveryHistory = async (decodedToken: JwtPayload) => {

    if (!decodedToken) throw new Error("decode token is not found")

    const parcel = await Parcel.find({
        receiver: decodedToken.userId,
        currentStatus: ParcelStatus.DELIVERED
    })
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })

    return {
        parcel
    }

}



export const ParcelService = {
    createParcel,
    cancelParcel,
    allParcel,
    getAllParcelByAdmin,
    updateIsBlocked,
    updateCurrentStatus,
    incomingParcel,
    confirmCurrentStatus,
    deliveryHistory

}