"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicate_1 = require("../helpers/handleDuplicate");
const handleZodError_1 = require("../helpers/handleZodError");
const env_1 = require("../config/env");
// import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    //  init err
    let errorSources = [];
    let statusCode = 500;
    let message = "Something is wrong !";
    // duplicate error
    if (err.code === 11000) {
        const simplifyError = (0, handleDuplicate_1.handleDuplicate)(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
    }
    //  zod error
    else if (err.name === "ZodError") {
        const simplifyError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorSources = simplifyError.errorSources;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    //     else if (err instanceof mongoose.Error.CastError) {
    //         statusCode = 400;
    //         message = `Invalid value for field "${err.path}": ${err.value}`
    //     }
    //     // Handle Mongoose ValidationError
    //    else if (err instanceof mongoose.Error.ValidationError) {
    //         const errors = Object.values(err.errors).map((el: any) => el.message);
    //         statusCode = 400;
    //         message = "Validation Error"
    //         err = errors
    //     }
    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        err: env_1.envVars.NODE_ENV === "development" ? err : null,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : null
    });
};
exports.default = globalErrorHandler;
