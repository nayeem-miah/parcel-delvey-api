import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFount = (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Route not found"
    })
}

export default notFount;