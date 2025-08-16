import { createUserToken } from "../../utils/useToken";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import bcrypt from 'bcrypt';



const credentialLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    // find user --> email
    const isExistsUser = await User.findOne({ email });

    if (!isExistsUser) {
        throw new Error("user not found ❌")
    }

    //  matching password
    const isPasswordMatch = await bcrypt.compare(password as string, isExistsUser.password as string)

    if (!isPasswordMatch) {
        throw new Error("Invalid password ❌")
    }
    //  create jwt token
    const generateToken = createUserToken(payload)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isExistsUser.toObject()
    return {
        accessToken: generateToken,
        user: rest
    }

}













export const AuthService = {
    credentialLogin
}