import { envVars } from "../config/env";
import { IsActive, Role } from "../modules/user/user.interface";
import bcrypt from 'bcrypt';
import prisma from "./prisma";

export const seedAdmin = async () => {
    try {
        const isExistUser = await prisma.user.findUnique({
            where: { email: envVars.ADMIN_EMAIL }
        });

        if (isExistUser) {
            console.log("⚠️ Admin user already exists, skipping...");
            return;
        }

        const hashPassword = await bcrypt.hash(
            envVars.ADMIN_PASS,
            Number(envVars.BCRYPT_SLOT_ROUND)
        );

        const admin = await prisma.user.create({
            data: {
                name: "Admin",
                role: Role.ADMIN,
                email: envVars.ADMIN_EMAIL,
                password: hashPassword,
                isActive: IsActive.ACTIVE,
                address: "Mymensingh"
            }
        });

        console.log("✅ Admin user seeded successfully:", admin.email);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
}