import { envVars } from "../config/env";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
    try {
        const isExistUser = await User.findOne({ email: envVars.ADMIN_EMAIL });

        if (isExistUser) {
            console.log("⚠️ Admin user already exists, skipping...");
            return;
        }

        // hash password
        const hasPassword = await bcrypt.hash(envVars.ADMIN_PASS, Number(envVars.BCRYPT_SLOT_ROUND))


        const payload = {
            name: " admin",
            role: Role.ADMIN,
            email: envVars.ADMIN_EMAIL,
            password: hasPassword,
            isActive: IsActive.ACTIVE,
            address: "Mymeensingh"
        }

        const superAdmin = await User.create(payload);
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
}