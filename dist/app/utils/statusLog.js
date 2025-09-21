"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusLogsDelivered = exports.updateStatusLogsInTransit = exports.updateStatusLogsDispatched = exports.updateStatusLogsApproved = exports.cancelLog = exports.initialStatusLog = void 0;
const parcel_interface_1 = require("../modules/parcel/parcel.interface");
const user_interface_1 = require("../modules/user/user.interface");
const initialStatusLog = (role, note) => {
    return {
        status: parcel_interface_1.ParcelStatus.REQUESTED,
        timestamp: new Date(),
        updatedBy: role || "SENDER",
        note: note || "Parcel created",
    };
};
exports.initialStatusLog = initialStatusLog;
const cancelLog = (role, note) => {
    return {
        status: parcel_interface_1.ParcelStatus.CANCELLED,
        timestamp: new Date(),
        updatedBy: role || "SENDER",
        note: note || "Parcel cancelled",
    };
};
exports.cancelLog = cancelLog;
const updateStatusLogsApproved = (role, note) => {
    return {
        status: parcel_interface_1.ParcelStatus.APPROVED,
        timestamp: new Date(),
        updatedBy: role || "ADMIN",
        note: note || "Parcel approved",
    };
};
exports.updateStatusLogsApproved = updateStatusLogsApproved;
const updateStatusLogsDispatched = (role, note) => {
    return {
        status: parcel_interface_1.ParcelStatus.DISPATCHED,
        timestamp: new Date(),
        updatedBy: role || user_interface_1.Role.ADMIN || "ADMIN",
        note: note || "Parcel dispatch",
    };
};
exports.updateStatusLogsDispatched = updateStatusLogsDispatched;
exports.updateStatusLogsInTransit = {
    status: parcel_interface_1.ParcelStatus.IN_TRANSIT,
    timestamp: new Date(),
    updatedBy: user_interface_1.Role.ADMIN || "ADMIN"
};
exports.updateStatusLogsDelivered = {
    status: parcel_interface_1.ParcelStatus.DELIVERED,
    timestamp: new Date(),
    updatedBy: user_interface_1.Role.RECEIVER || "RECEIVER",
    note: "Parcel deliver",
};
