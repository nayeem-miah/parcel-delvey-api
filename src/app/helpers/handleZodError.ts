/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenicErrorResponse } from "../interfaces/error.types";

export const handleZodError = (err: any): TGenicErrorResponse => {
    const errorSources: TErrorSource[] = [];


    err.issues.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    });

    return {
        statusCode: 400,
        message: "zod Error",
        errorSources
    }
};