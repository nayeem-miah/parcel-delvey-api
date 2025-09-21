"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const user_interface_1 = require("../user/user.interface");
// StatusLog SubSchema
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
        required: true
    },
    timestamp: { type: Date, default: Date.now },
    updatedBy: {
        type: String,
        enum: [...Object.values(user_interface_1.Role)],
        default: user_interface_1.Role.SENDER,
    },
    note: { type: String },
}, {
    _id: false,
    versionKey: false
});
// Parcel Schema
const ParcelSchema = new mongoose_1.Schema({
    tracking_id: {
        type: String,
        unique: true
    },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    fee: { type: Number },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderPhone: { type: String, required: true },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverPhone: { type: String, required: true },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
        required: true,
    },
    statusLogs: {
        type: [StatusLogSchema],
        default: []
    },
    expectedDeliveryDate: { type: Date },
    deliveredAt: { type: Date },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });
exports.Parcel = (0, mongoose_1.model)("Parcel", ParcelSchema);
