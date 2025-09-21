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
exports.seedAdmin = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExistUser = yield user_model_1.User.findOne({ email: env_1.envVars.ADMIN_EMAIL });
        if (isExistUser) {
            console.log("⚠️ Admin user already exists, skipping...");
            return;
        }
        // hash password
        const hasPassword = yield bcrypt_1.default.hash(env_1.envVars.ADMIN_PASS, Number(env_1.envVars.BCRYPT_SLOT_ROUND));
        const payload = {
            name: " admin",
            role: user_interface_1.Role.ADMIN,
            email: env_1.envVars.ADMIN_EMAIL,
            password: hasPassword,
            isActive: user_interface_1.IsActive.ACTIVE,
            address: "Mymeensingh"
        };
        const superAdmin = yield user_model_1.User.create(payload);
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedAdmin = seedAdmin;
