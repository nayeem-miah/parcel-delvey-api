import { model, Schema } from "mongoose";
import { IParcel, IStatusLog, ParcelStatus } from "./parcel.interface";
import { Role } from "../user/user.interface";


// StatusLog SubSchema
const StatusLogSchema = new Schema<IStatusLog>(
    {
        status: {
            type: String,
            enum: Object.values(ParcelStatus),
            default: ParcelStatus.REQUESTED,
            required: true,
        },
        timestamp: { type: Date, default: Date.now },
        updatedBy: {
            type: String,
            enum: Object.values(Role),
            required: true,
        },
        note: { type: String },
    },
    {
        _id: false,
        versionKey: false
    },

);

// Parcel Schema
const ParcelSchema = new Schema<IParcel>(
    {
        tracking_id: {
            type: String,
            required: true,
            unique: true
        },
        type: { type: String, required: true },
        weight: { type: Number, required: true },
        fee: { type: Number, required: true },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        senderPhone: { type: String, required: true },

        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverPhone: { type: String, required: true },

        currentStatus: {
            type: String,
            enum: Object.values(ParcelStatus),
            default: ParcelStatus.REQUESTED,
            required: true,
        },

        statusLogs: {
            type: [StatusLogSchema],
            default: []
        },

        expectedDeliveryDate: { type: Date },
        deliveredAt: { type: Date },

        isBlocked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Parcel = model<IParcel>("Parcel", ParcelSchema);
