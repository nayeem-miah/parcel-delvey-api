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
exports.ParcelController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = require("http-status-codes");
const trackingId_1 = require("../../utils/trackingId");
const calculateFee_1 = require("../../utils/calculateFee");
const parcel_interface_1 = require("./parcel.interface");
const user_model_1 = require("../user/user.model");
const statusLog_1 = require("../../utils/statusLog");
//  sender parcel
const createParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    // find user 
    const isExistUSer = yield user_model_1.User.findOne({ email: decodeToken.email });
    if (!((isExistUSer === null || isExistUSer === void 0 ? void 0 : isExistUSer.address) && isExistUSer.address.length > 0)) {
        throw new Error("please update your profile address ");
    }
    const trackingId = (0, trackingId_1.generateTrackingId)();
    const totalFrr = (0, calculateFee_1.calculateFrr)(req.body.weight);
    const payload = Object.assign(Object.assign({}, req.body), { tracking_id: trackingId, currentStatus: parcel_interface_1.ParcelStatus.REQUESTED, fee: totalFrr, statusLogs: [(0, statusLog_1.initialStatusLog)(isExistUSer.role, req.body.note)] });
    const result = yield parcel_service_1.ParcelService.createParcel(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: "Parcel create success ✅",
        data: result.parcel
    });
    // 
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const decodeToken = req.user;
    const { note } = req.body || "parcel canceled";
    const result = yield parcel_service_1.ParcelService.cancelParcel(id, decodeToken, note);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Parcel cancel success ✅",
        data: result.UpdatedCancelled
    });
}));
const allParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.allParcel(query, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Sender Parcel retrieved success ✅",
        data: result.data,
        meta: result.meta
    });
}));
//  admin parcel
const getAllParcelByAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.getAllParcelByAdmin(query, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Äll Parcel retrieved success ✅",
        data: result.data,
        meta: result.meta
    });
}));
const updateIsBlocked = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.updateIsBlocked(id, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `this parcel is ${result.updateData.isBlocked ? 'Blocked' : "unBlocked"} success✅`,
        data: result.updateData,
        // meta: result.meta
    });
}));
const updateCurrentStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const decodeToken = req.user;
    const { note } = req.body || "parcel current status updated";
    const result = yield parcel_service_1.ParcelService.updateCurrentStatus(id, decodeToken, note);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `parcel current status  ${(_a = result.updateData) === null || _a === void 0 ? void 0 : _a.currentStatus} success✅`,
        data: result.updateData,
        // meta: result.meta
    });
}));
// Receiver parcel
const incomingParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.incomingParcel(decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `parcel received success✅`,
        data: result.incoming,
        meta: {
            total: result.meta.total,
            limit: result.meta.limit,
            page: result.meta.page,
            totalPage: result.meta.page
        }
    });
}));
const confirmCurrentStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.confirmCurrentStatus(id, decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `parcel DELIVERED success✅`,
        data: result.confirmStatus,
    });
}));
const deliveryHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.deliveryHistory(decodeToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `all delivery history received success✅`,
        data: result.parcel,
    });
}));
const achievement = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelService.achievement();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `all delivery history received success✅`,
        data: result,
    });
}));
exports.ParcelController = {
    createParcel,
    cancelParcel,
    allParcel,
    getAllParcelByAdmin,
    updateIsBlocked,
    updateCurrentStatus,
    incomingParcel,
    confirmCurrentStatus,
    deliveryHistory,
    achievement
};
