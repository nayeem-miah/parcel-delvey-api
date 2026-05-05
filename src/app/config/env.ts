import dotenv from "dotenv"

dotenv.config()

interface IEnvFile {
    PORT: string
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    BCRYPT_SLOT_ROUND: string;
    ADMIN_EMAIL: string
    ADMIN_PASS: string;
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION: string;
    FRONTEND_URL: string;
}

const localVariable = (): IEnvFile => {

    const requireVariable: string[] = [
        "PORT",
        "NODE_ENV",
        "BCRYPT_SLOT_ROUND",
        "ADMIN_EMAIL",
        "ADMIN_PASS",
        "JWT_SECRET",
        "JWT_EXPIRE",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "EXPRESS_SESSION",
        "FRONTEND_URL",
        "DATABASE_URL"
    ]

    const missingVariables: string[] = [];
    requireVariable.forEach(key => {
        if (!process.env[key]) {
            missingVariables.push(key);
        }
    });

    if (missingVariables.length > 0) {
        throw new Error(`❌ Missing required environment variables: ${missingVariables.join(", ")}`);
    }

    return {
        PORT: process.env.PORT as string,
        NODE_ENV: process.env.NODE_ENV as ("development" | "production"),
        BCRYPT_SLOT_ROUND: process.env.BCRYPT_SLOT_ROUND as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASS: process.env.ADMIN_PASS as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRE: process.env.JWT_EXPIRE as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        EXPRESS_SESSION: process.env.EXPRESS_SESSION as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
    }

};

export const envVars = localVariable();