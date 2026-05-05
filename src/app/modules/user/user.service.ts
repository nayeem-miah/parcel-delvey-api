import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { Role } from "./user.interface";

const createUser = async (payload: any) => {
    const { email, password, ...rest } = payload;

    const isExistUser = await prisma.user.findUnique({
        where: { email }
    });

    if (isExistUser) {
        throw new AppError(StatusCodes.CONFLICT, "User already exists");
    }

    const hashPassword = await bcrypt.hash(
        password as string,
        Number(envVars.BCRYPT_SLOT_ROUND)
    );

    const user = await prisma.user.create({
        data: {
            email,
            password: hashPassword,
            ...rest
        }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
};

const userProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const allUser = async () => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return users.map(({ password: _, ...rest }) => rest);
};

const singleUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const updateUser = async (userId: string, payload: any, decodedToken: JwtPayload) => {
    if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
        }
    }

    const isExistUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!isExistUser) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (payload.role && decodedToken.role !== Role.ADMIN) {
        throw new AppError(StatusCodes.FORBIDDEN, "Only admins can update roles");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: payload
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
};

export const UserService = {
    createUser,
    userProfile,
    allUser,
    singleUser,
    updateUser,
};
