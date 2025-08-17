import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";




export const checkAuth = (...AuthRoutes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new Error("access token not found")
        }

        //  verify token 
        const verifyToken = jwt.verify(accessToken, envVars.JWT_SECRET) as JwtPayload;

        const isExistUser = await User.findOne({ email: verifyToken.email });

        if (!isExistUser) {
            throw new Error("user not found !")
        }

        if (isExistUser.isActive === IsActive.BLOCKED) {
            throw new Error("user is BLOCKED !")
        };

        //  checking role
        if (!AuthRoutes.includes(verifyToken.role)) {
            throw new Error("you are not permeated to view this route !")
        }

        req.user = verifyToken;
        next()

    } catch (error) {
        next(error)
    }



}