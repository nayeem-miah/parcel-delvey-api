import { Types } from "mongoose";
import { Role } from "../user/user.interface";

export enum ParcelStatus {
    REQUESTED = "REQUESTED",
    APPROVED = "APPROVED",
    DISPATCHED = "DISPATCHED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}


export interface IStatusLog {
    status: ParcelStatus;
    timestamp: Date;
    updatedBy: Role
    note?: string;
}


export interface IParcel {
    _id: Types.ObjectId,
    tracking_id: string;
    type: string;
    weight: number;
    fee: number;
    sender: Types.ObjectId;
    senderPhone?: string;
    receiver: Types.ObjectId;
    receiverPhone?: string;
    currentStatus: ParcelStatus;
    statusLogs: IStatusLog[];
    expectedDeliveryDate?: Date;
    deliveredAt?: Date;
    isBlocked?: boolean;
    createdAt: Date
}