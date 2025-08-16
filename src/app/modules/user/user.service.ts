import { envVars } from "../../config/env";
import { IUser } from "./user.interface"
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

export const UserService = {
    createUser,
}

