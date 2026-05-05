/* eslint-disable no-console */
import { Server } from "http";
import app from "./app"
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/utils/seedAdmin";
import prisma from "./app/utils/prisma";

let server: Server;

const startServer = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        // Test Prisma connection
        await prisma.$connect();
        console.log("✅ Database connected successfully (Prisma)");

        // Better Vercel detection
        const isVercel = process.env.VERCEL === '1' || !!process.env.NOW_REGION;

        if (!isVercel) {
            console.log("🌐 Local environment detected, starting server...");
            server = app.listen(envVars.PORT || 5000, () => {
                console.log(`🚀 Server is listening on http://localhost:${envVars.PORT || 5000}`)
            })
        } else {
            console.log("☁️ Vercel environment detected, skipping app.listen()");
        }
        
        console.log("⏳ Seeding admin user...");
        // Seed admin user
        await seedAdmin();
        console.log("✅ Seeding process finished");

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
    }
}

startServer();

export default app;

// Handle graceful shutdown
const shutdown = async (signal: string) => {
    console.log(`${signal} signal received. Shutting down...`);
    if (server) {
        server.close(async () => {
            await prisma.$disconnect();
            console.log("✅ Prisma disconnected");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on("unhandledRejection", (err) => {
    console.log("❌ Unhandled Rejection:", err);
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

process.on("uncaughtException", (err) => {
    console.log("❌ Uncaught Exception:", err);
    process.exit(1);
});

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));