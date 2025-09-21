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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const env_1 = require("../../config/env");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isExistUser = yield user_model_1.User.findOne({ email });
    if (isExistUser) {
        throw new Error("user already exists");
    }
    const hashPassword = yield bcrypt_1.default
        .hash(password, Number(env_1.envVars.BCRYPT_SLOT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email: email, password: hashPassword }, rest));
    return {
        data: user
    };
});
const userProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return user;
});
const allUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find().select("-password");
    return {
        user
    };
});
const singleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.findOne({ _id: id }).select("-password");
    return {
        users
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role === user_interface_1.Role.RECEIVER || decodedToken.role === user_interface_1.Role.SENDER) {
        if (userId !== decodedToken.userId) {
            throw new Error("you are not authorized");
        }
    }
    // find user 
    const isExistUser = yield user_model_1.User.findById(userId);
    if (!isExistUser) {
        throw new Error("user not found!");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.RECEIVER || decodedToken.role === user_interface_1.Role.SENDER) {
            throw new Error("you are not authorized");
        }
    }
    const newUpdateUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true
    }).select("-password");
    return newUpdateUser;
});
exports.UserService = {
    createUser,
    userProfile,
    allUser,
    singleUser,
    updateUser,
};
