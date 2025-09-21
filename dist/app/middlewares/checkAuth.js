"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...AuthRoutes) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        // console.log(accessToken);
        if (!accessToken) {
            throw new Error("access token not found");
        }
        //  verify token 
        const verifyToken = jsonwebtoken_1.default.verify(accessToken, env_1.envVars.JWT_SECRET);
        const isExistUser = yield user_model_1.User.findOne({ email: verifyToken.email });
        if (!isExistUser) {
            throw new Error("user not found !");
        }
        if (isExistUser.isActive === user_interface_1.IsActive.BLOCKED) {
            throw new Error("user is BLOCKED !");
        }
        ;
        //  checking role
        if (!AuthRoutes.includes(verifyToken.role)) {
            throw new Error("you are not permeated to view this route !");
        }
        req.user = verifyToken;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
