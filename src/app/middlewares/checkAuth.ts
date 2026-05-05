import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive } from "../modules/user/user.interface";
import prisma from "../utils/prisma";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;

        if (!accessToken) {
            throw new AppError(StatusCodes.UNAUTHORIZED, "Access token not found");
        }

        // Verify token 
        const decoded = jwt.verify(accessToken, envVars.JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { email: decoded.email }
        });

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
        }

        if (user.isActive === IsActive.BLOCKED) {
            throw new AppError(StatusCodes.FORBIDDEN, "Your account is blocked!");
        };

        // Checking role
        if (authRoles.length > 0 && !authRoles.includes(decoded.role)) {
            throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized to access this route!");
        }

        req.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
}