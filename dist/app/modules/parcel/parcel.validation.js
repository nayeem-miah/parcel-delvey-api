"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelValidation = exports.createParcelValidation = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
const user_interface_1 = require("../user/user.interface");
// status log schema
const StatusLogValidation = zod_1.z.object({
    status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus),
    timestamp: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).default(() => new Date()),
    updatedBy: zod_1.z.nativeEnum(user_interface_1.Role),
    note: zod_1.z.string().optional(),
});
//  ParcelValidation zod schema
const ParcelValidation = zod_1.z.object({
    type: zod_1.z.string().min(1, "Parcel type is required"),
    weight: zod_1.z.number().positive("Weight must be positive"),
    fee: zod_1.z.number().nonnegative("Fee must be non-negative").optional(),
    sender: zod_1.z.string().min(1, "Sender ID is required"),
    senderPhone: zod_1.z.string().min(1, "Sender phone is required"),
    receiver: zod_1.z.string().min(1, "Receiver ID is required"),
    receiverPhone: zod_1.z.string().min(1, "Receiver phone is required"),
    currentStatus: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)).default(parcel_interface_1.ParcelStatus.REQUESTED),
    statusLogs: zod_1.z.array(StatusLogValidation).optional(),
    expectedDeliveryDate: zod_1.z.string().datetime().optional(),
    deliveredAt: zod_1.z.string().datetime().optional(),
    isBlocked: zod_1.z.boolean().default(false),
});
exports.createParcelValidation = ParcelValidation.strict();
//  all optional 
exports.updateParcelValidation = ParcelValidation.partial().strict();
