"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name is short minimum 2 character")
        .nonempty({ message: "name is required" }),
    email: zod_1.default.string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email address!" }),
    password: zod_1.default.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
    role: zod_1.default.enum([user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER], {
        message: "Role must be either SENDER or RECEIVER"
    }).default(user_interface_1.Role.SENDER).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive))
        .default(user_interface_1.IsActive.ACTIVE).optional(),
    phone: zod_1.default.string()
        .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
        message: "Invalid Bangladeshi phone number"
    })
        .optional(),
    address: zod_1.default.string().optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name is short minimum 2 character")
        .optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    phone: zod_1.default.string()
        .regex(/^(\+8801|8801|01)[0-9]{9}$/, {
        message: "Invalid Bangladeshi phone number"
    })
        .optional(),
    address: zod_1.default.string().optional(),
});
