import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.SENDER
    },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    address: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});




export const User = model<IUser>("User", userSchema);