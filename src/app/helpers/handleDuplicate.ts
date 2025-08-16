import { TGenicErrorResponse } from "../interfaces/error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicate = (err: any): TGenicErrorResponse => {
    const matchArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message: `${matchArray[1]} already exists`
    }
}