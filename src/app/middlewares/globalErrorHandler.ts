/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);



    const statusCode = 500
    const message = "Something is wrong !"
    res.status(statusCode).json({
        success: false,
        message: message,
        error: err
    })
};

export default globalErrorHandler