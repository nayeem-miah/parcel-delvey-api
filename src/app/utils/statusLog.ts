import { IStatusLog, ParcelStatus } from "../modules/parcel/parcel.interface";
import { Role } from "../modules/user/user.interface";


export const initialStatusLog = (role: Role, note: string): IStatusLog => {
    return {
        status: ParcelStatus.REQUESTED,
        timestamp: new Date(),
        updatedBy: role || "SENDER",
        note: note || "Parcel created",
    }
}

export const cancelLog = (role: Role, note: string): IStatusLog => {
    return {
        status: ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: role || "SENDER",
        note: note || "Parcel cancelled",
    }
}

export const updateStatusLogsApproved = (role: Role, note: string): IStatusLog => {
    return {
        status: ParcelStatus.APPROVED,
        timestamp: new Date(),
        updatedBy: role || "ADMIN",
        note: note || "Parcel approved",
    }
}

export const updateStatusLogsDispatched = (role: Role, note: string): IStatusLog => {
    return {
        status: ParcelStatus.DISPATCHED,
        timestamp: new Date(),
        updatedBy: role || Role.ADMIN || "ADMIN",
        note: note || "Parcel dispatch",
    }
}

export const updateStatusLogsInTransit: IStatusLog = {
    status: ParcelStatus.IN_TRANSIT,
    timestamp: new Date(),
    updatedBy: Role.ADMIN || "ADMIN"
}

export const updateStatusLogsDelivered = {
    status: ParcelStatus.DELIVERED,
    timestamp: new Date(),
    updatedBy: Role.RECEIVER || "RECEIVER",
    note: "Parcel deliver",
};
