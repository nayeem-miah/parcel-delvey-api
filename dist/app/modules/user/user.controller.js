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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "user create success success ✅",
        data: result
    });
}));
const userProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserService.userProfile(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "user created success ✅",
        data: result
    });
}));
const allUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.allUser();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "all user received success ✅",
        data: result.user
    });
}));
const singleUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.singleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "user created success ✅",
        data: result
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const verifyToken = req.user;
    const result = yield user_service_1.UserService.updateUser(userId, payload, verifyToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "user update success ✅",
        data: result
    });
}));
exports.UserController = {
    createUser,
    userProfile,
    allUser,
    singleUser,
    updateUser
};
