
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { handleDuplicate } from "../helpers/handleDuplicate";
import { TErrorSource } from "../interfaces/error.types";
import { handleZodError } from "../helpers/handleZodError";
import { envVars } from "../config/env";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);


    //  init err
    let errorSources: TErrorSource[] = [];
    let statusCode = 500;
    let message = "Something is wrong !"


    // duplicate error
    if (err.code === 11000) {
        const simplifyError = handleDuplicate(err)
        statusCode = simplifyError.statusCode;
        message = simplifyError.message
    }

    //  zod error
    else if (err.name === "ZodError") {
        const simplifyError = handleZodError(err);
        statusCode = simplifyError.statusCode;
        message = simplifyError.message;
        errorSources = simplifyError.errorSources as TErrorSource[]
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
};

export default globalErrorHandler