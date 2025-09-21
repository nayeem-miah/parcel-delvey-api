"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserToken = void 0;
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const generateToken = jsonwebtoken_1.default.sign(jwtPayload, env_1.envVars.JWT_SECRET, {
        expiresIn: env_1.envVars.JWT_EXPIRE
    });
    return generateToken;
};
exports.createUserToken = createUserToken;
