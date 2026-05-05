import { createUserToken } from "../../utils/useToken";
import prisma from "../../utils/prisma";
import bcrypt from 'bcrypt';
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const credentialLogin = async (payload: any) => {
    const { email, password } = payload;

    if (!password) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Password is required ❌");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found ❌");
    }

    if (!user.password) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid login method. Please use Google Login ❌");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid password ❌");
    }

    const accessToken = createUserToken(user as any);

    const { password: _, ...userWithoutPassword } = user;

    return {
        accessToken,
        user: userWithoutPassword
    };
}

export const AuthService = {
    credentialLogin
}