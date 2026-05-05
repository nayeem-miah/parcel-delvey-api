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
    updatedBy: Role;
    note?: string;
}

export interface IParcel {
    id: string;
    tracking_id: string;
    type: string;
    weight: number;
    fee: number;
    senderId: string;
    senderPhone?: string;
    receiverId: string;
    receiverPhone?: string;
    currentStatus: ParcelStatus;
    statusLogs: IStatusLog[];
    expectedDeliveryDate?: Date;
    deliveredAt?: Date;
    isBlocked?: boolean;
    createdAt: Date;
}