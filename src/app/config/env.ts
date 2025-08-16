import dotenv from "dotenv"

dotenv.config()

interface IEnvFile {
    PORT: string
    MONGODB_URI: string;
    NODE_ENV: string;
    BCRYPT_SLOT_ROUND: string;
    ADMIN_EMAIL: string
    ADMIN_PASS: string
}

const localVariable = (): IEnvFile => {

    const requireVariable: string[] = [
        "PORT",
        "MONGODB_URI",
        "NODE_ENV",
        "BCRYPT_SLOT_ROUND",
        "ADMIN_EMAIL",
        "ADMIN_PASS",
    ]

    requireVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_ENV: process.env.NODE_ENV as ("development" | "production"),
        BCRYPT_SLOT_ROUND: process.env.BCRYPT_SLOT_ROUND as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASS: process.env.ADMIN_PASS as string,
    }

};

export const envVars = localVariable();