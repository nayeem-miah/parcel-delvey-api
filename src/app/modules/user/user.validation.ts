import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string().min(2, "Name is short minimum 2 character")
        .nonempty({ message: "name is required" }),

    email: z.string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email address!" }),

    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),

    role: z.enum([Role.SENDER, Role.RECEIVER], {
        message: "Role must be either SENDER or RECEIVER"
    }).default(Role.SENDER).optional(),

    isActive: z.enum(Object.values(IsActive))
        .default(IsActive.ACTIVE).optional(),

    address: z.string().optional(),
})


export const updateUserZodSchema = z.object({
    name: z.string().min(2, "Name is short minimum 2 character")
        .optional(),
    address: z.string().optional(),
})