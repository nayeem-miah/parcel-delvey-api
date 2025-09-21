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
exports.AuthService = void 0;
const useToken_1 = require("../../utils/useToken");
const user_model_1 = require("../user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const credentialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // find user --> email
    const isExistsUser = yield user_model_1.User.findOne({ email });
    if (!isExistsUser) {
        throw new Error("user not found ❌");
    }
    //  matching password
    const isPasswordMatch = yield bcrypt_1.default.compare(password, isExistsUser.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid password ❌");
    }
    //  create jwt token
    const generateToken = (0, useToken_1.createUserToken)(isExistsUser);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = isExistsUser.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: generateToken,
        user: rest
    };
});
exports.AuthService = {
    credentialLogin
};
