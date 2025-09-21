"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicate = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicate = (err) => {
    const matchArray = err.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchArray[1]} already exists`
    };
};
exports.handleDuplicate = handleDuplicate;
