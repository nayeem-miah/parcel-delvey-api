import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IUser, Role } from "./user.interface"
import { User } from "./user.model"
import bcrypt from "bcrypt"



const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
        throw new Error("user already exists")
    }

    const hashPassword = await bcrypt
        .hash(password as string, Number(envVars.BCRYPT_SLOT_ROUND))

    const user = await User.create({
        email: email,
        password: hashPassword,
        ...rest

    })

    return {
        data: user
    }
};

const userProfile = async (userId: string) => {
    const user = await User.findById(userId).select("-password")

    return user
}

const allUser = async () => {
    const user = await User.find().select("-password");

    return {
        user
    }
}

const singleUser = async (id: string) => {
    const users = await User.findOne({ _id: id }).select("-password");

    return {
        users
    }
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
        if (userId !== decodedToken.userId) {
            throw new Error("you are not authorized")
        }
    }

    // find user 
    const isExistUser = await User.findById(userId);

    if (!isExistUser) {
        throw new Error("user not found!")
    }

    if (payload.role) {
        if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
            throw new Error("you are not authorized")
        }
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    }).select("-password")

    return newUpdateUser
};




export const UserService = {
    createUser,
    userProfile,
    allUser,
    singleUser,
    updateUser,

}

