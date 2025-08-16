import dotenv from "dotenv"

dotenv.config()

interface IEnvFile {
    PORT: string
    MONGODB_URI: string;
    NODE_ENV: string
}

const localVariable = (): IEnvFile => {

    const requireVariable: string[] = [
        "PORT", "MONGODB_URI", "NODE_ENV"
    ]

    requireVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_ENV: process.env.NODE_ENV as ("development" | "production")
    }

};

export const envVars = localVariable();