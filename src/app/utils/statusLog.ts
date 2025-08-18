import { IStatusLog, ParcelStatus } from "../modules/parcel/parcel.interface";
import { Role } from "../modules/user/user.interface";

export const updateStatusLogsApproved: IStatusLog = {
    status: ParcelStatus.APPROVED,
    timestamp: new Date(),
    updatedBy: Role.ADMIN || "ADMIN"
}
export const updateStatusLogsDispatched: IStatusLog = {
    status: ParcelStatus.DISPATCHED,
    timestamp: new Date(),
    updatedBy: Role.ADMIN || "ADMIN"
}
export const updateStatusLogsInTransit: IStatusLog = {
    status: ParcelStatus.IN_TRANSIT,
    timestamp: new Date(),
    updatedBy: Role.ADMIN || "ADMIN"
}