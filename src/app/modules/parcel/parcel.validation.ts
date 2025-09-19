
import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";
import { Role } from "../user/user.interface";

// status log schema
const StatusLogValidation = z.object({
    status: z.nativeEnum(ParcelStatus),
    timestamp: z.union([z.string(), z.date()]).default(() => new Date()),
    updatedBy: z.nativeEnum(Role),
    note: z.string().optional(),
});

//  ParcelValidation zod schema
const ParcelValidation = z.object({

    type: z.string().min(1, "Parcel type is required"),
    weight: z.number().positive("Weight must be positive"),
    fee: z.number().nonnegative("Fee must be non-negative").optional(),

    sender: z.string().min(1, "Sender ID is required"),
    senderPhone: z.string().min(1, "Sender phone is required"),
    receiver: z.string().min(1, "Receiver ID is required"),
    receiverPhone: z.string().min(1, "Receiver phone is required"),

    currentStatus: z.enum(Object.values(ParcelStatus)).default(ParcelStatus.REQUESTED),

    statusLogs: z.array(StatusLogValidation).optional(),

    expectedDeliveryDate: z.string().datetime().optional(),
    deliveredAt: z.string().datetime().optional(),


    isBlocked: z.boolean().default(false),
});


export const createParcelValidation = ParcelValidation.strict();

//  all optional 
export const updateParcelValidation = ParcelValidation.partial().strict();
