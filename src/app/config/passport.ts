import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { IsActive, Role } from "../modules/user/user.interface";
import prisma from "../utils/prisma";

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(null, false, { message: "No email found" });
                };

                let user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: profile.displayName,
                            role: Role.SENDER, // Default to SENDER
                            isActive: IsActive.ACTIVE,
                        }
                    });
                }

                return done(null, user);

            } catch (error) {
                console.error("Google Strategy Error:", error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        done(null, user);
    } catch (error) {
        console.error("Deserialize User Error:", error);
        done(error);
    }
});
