"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.ParcelService = void 0;
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const statusLog_1 = require("../../utils/statusLog");
//  sender services
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.create(payload);
    return {
        parcel
    };
});
const cancelParcel = (_id, decodeToken, note) => __awaiter(void 0, void 0, void 0, function* () {
    //  find parcel by tracking_id
    const parcel = yield parcel_model_1.Parcel.findOne({ _id });
    if (!parcel) {
        throw new Error("parcel not found!");
    }
    //  checking parcel status checking sender
    if (decodeToken.role === user_interface_1.Role.SENDER) {
        if (parcel.currentStatus !== parcel_interface_1.ParcelStatus.REQUESTED && parcel.currentStatus !== parcel_interface_1.ParcelStatus.APPROVED) {
            throw new Error(`Parcel already ${parcel.currentStatus}, cannot be cancelled!`);
        }
        ;
    }
    //  checking admin
    if (decodeToken.role === user_interface_1.Role.ADMIN) {
        if (parcel.currentStatus === parcel_interface_1.ParcelStatus.DELIVERED) {
            throw new Error("admin can not cancel delivered parcel !");
        }
        if (parcel.currentStatus === parcel_interface_1.ParcelStatus.CANCELLED) {
            throw new Error("this parcel already cancel !");
        }
    }
    const UpdatedCancelled = yield parcel_model_1.Parcel.findByIdAndUpdate(_id, {
        $set: { currentStatus: parcel_interface_1.ParcelStatus.CANCELLED },
        $push: { statusLogs: (0, statusLog_1.cancelLog)(decodeToken.role, note) }
    }, { new: true, runValidators: true });
    return {
        UpdatedCancelled
    };
});
const allParcel = (query, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodeToken.role !== user_interface_1.Role.SENDER) {
        throw new Error("You can not access this route");
    }
    //  pagination implement
    /** pagination --> ?page=30&limit=10
     * page --- 1
     * limit  --> 10
     * skip = (page-1) * limit ---> 1 st page skip --> 1-1  * 10 --> skip --> 0,
     * skip = (page-1) * limit ---> 2 st page skip --> 2-1  * 10 --> skip --> 10,
     * skip = (page-1) * limit ---> 3 st page skip --> 3-1  * 10 --> skip --> 20,
     */
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalCountParcel = yield parcel_model_1.Parcel.countDocuments({ sender: decodeToken.userId });
    const totalPage = Math.ceil(totalCountParcel / limit);
    // sender parcel find 
    const senderParcel = yield parcel_model_1.Parcel.find({ sender: decodeToken.userId })
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const meta = {
        page: page,
        limit: limit,
        total: totalCountParcel,
        totalPage: totalPage
    };
    return {
        data: senderParcel,
        meta: meta
    };
});
//  admin parcel services
const getAllParcelByAdmin = (query, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    // all?filter=REQUESTED
    const filter = query.filter ? { currentStatus: query.filter } : {};
    if (decodeToken.role !== user_interface_1.Role.ADMIN) {
        throw new Error("You can not access this route");
    }
    //  pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalCountParcel = yield parcel_model_1.Parcel.countDocuments(filter);
    const totalPage = Math.ceil(totalCountParcel / limit);
    // sender parcel find 
    const senderParcel = yield parcel_model_1.Parcel.find(filter)
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    const meta = {
        page: page,
        limit: limit,
        total: totalCountParcel,
        totalPage: totalPage
    };
    return {
        data: senderParcel,
        meta: meta
    };
});
const updateIsBlocked = (id, decodeToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.findOne({ email: decodeToken.email });
    if (!isExistUser) {
        throw new Error("user not found !");
    }
    if (isExistUser.role !== user_interface_1.Role.ADMIN) {
        throw new Error("You can not access this route");
    }
    ;
    const parcel = yield parcel_model_1.Parcel.findById(id);
    let updateData;
    if (parcel === null || parcel === void 0 ? void 0 : parcel.isBlocked) {
        updateData = yield parcel_model_1.Parcel.findByIdAndUpdate(id, { isBlocked: false }, { new: true, runValidators: true });
    }
    else {
        updateData = yield parcel_model_1.Parcel.findByIdAndUpdate(id, { isBlocked: true }, { new: true, runValidators: true });
    }
    return {
        updateData
    };
});
const updateCurrentStatus = (id, decodeToken, note) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodeToken.role !== user_interface_1.Role.ADMIN) {
        throw new Error("you are not authorized to access this route");
    }
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel)
        throw new Error("parcel not found");
    let newStatus = null;
    let newLog = null;
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.CANCELLED) {
        throw new Error("this parcel already cancel! so you cannot update current status");
    }
    else if (parcel.currentStatus === parcel_interface_1.ParcelStatus.REQUESTED) {
        newStatus = parcel_interface_1.ParcelStatus.APPROVED;
        newLog = (0, statusLog_1.updateStatusLogsApproved)(user_interface_1.Role.ADMIN, note);
    }
    else if (parcel.currentStatus === parcel_interface_1.ParcelStatus.APPROVED) {
        newStatus = parcel_interface_1.ParcelStatus.DISPATCHED;
        newLog = (0, statusLog_1.updateStatusLogsDispatched)(user_interface_1.Role.ADMIN, note);
    }
    else if (parcel.currentStatus === parcel_interface_1.ParcelStatus.DISPATCHED) {
        throw new Error("Parcel already DISPATCHED");
    }
    const updateData = yield parcel_model_1.Parcel.findByIdAndUpdate(id, {
        $set: { currentStatus: newStatus },
        $push: { statusLogs: newLog }
    }, { new: true, runValidators: true });
    return { updateData };
});
// Receiver parcel services
const incomingParcel = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const incoming = yield parcel_model_1.Parcel.find({ receiver: decodedToken.userId })
        .populate("sender", "name email address phone")
        .populate("receiver", "name email address phone");
    const totalCount = yield parcel_model_1.Parcel.countDocuments({ receiver: decodedToken.userId });
    const meta = {
        total: totalCount,
        limit: 0,
        page: 0,
        totalPage: 0
    };
    return {
        incoming,
        meta
    };
});
const confirmCurrentStatus = (id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (decodedToken.role !== user_interface_1.Role.RECEIVER) {
        throw new Error("you are not authorized this route");
    }
    const parcel = yield parcel_model_1.Parcel.findOne({ receiver: decodedToken.userId, _id: id });
    if (!parcel) {
        throw new Error("parcel not fount");
    }
    if (parcel.currentStatus !== parcel_interface_1.ParcelStatus.DISPATCHED) {
        throw new Error(`Invalid status: Parcel is currently ${parcel.currentStatus}, expected DISPATCHED.`);
    }
    ;
    const confirmStatus = yield parcel_model_1.Parcel.findByIdAndUpdate(parcel._id, {
        $set: { currentStatus: parcel_interface_1.ParcelStatus.DELIVERED },
        $push: { statusLogs: statusLog_1.updateStatusLogsDelivered }
    }, { new: true, runValidators: true });
    return {
        confirmStatus
    };
});
const deliveryHistory = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!decodedToken)
        throw new Error("decode token is not found");
    const parcel = yield parcel_model_1.Parcel.find({
        receiver: decodedToken.userId,
        currentStatus: parcel_interface_1.ParcelStatus.DELIVERED
    })
        .populate('sender', 'name email address')
        .populate('receiver', 'name email address')
        .sort({ createdAt: -1 });
    return {
        parcel
    };
});
const achievement = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcelCount = yield parcel_model_1.Parcel.countDocuments();
    const clientCount = yield user_model_1.User.countDocuments();
    return {
        parcelCount,
        clientCount
    };
});
exports.ParcelService = {
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
