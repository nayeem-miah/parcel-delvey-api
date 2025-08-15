
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app"

let server: Server;


const startServer = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/parcelDB")
        console.log("connect db");

        server = app.listen(5000, () => {
            console.log(`Server is listening to port http://localhost:5000`)
        })
    } catch (error) {
        console.log(error)
    }
}



(async () => {
    await startServer()
})()


process.on("unhandledRejection", (err) => {
    console.log("unhandled rejection detracted .............Server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.log("uncaught exception error........ server is shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received .........server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGINT", () => {
    console.log("SIGINT signal received .........server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})