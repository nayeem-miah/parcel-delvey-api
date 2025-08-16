
import { IUser } from "../modules/user/user.interface";
import { envVars } from "../config/env";
import { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

export const createUserToken = (user: Partial<IUser>) => {

    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const generateToken = jwt.sign(jwtPayload, envVars.JWT_SECRET, {
        expiresIn: envVars.JWT_EXPIRE
    } as SignOptions);
    return generateToken
}