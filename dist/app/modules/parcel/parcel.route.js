"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoute = void 0;
const express_1 = require("express");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parcel_validation_1 = require("./parcel.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const router = (0, express_1.Router)();
//  sender route
router.post("/", (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelValidation), (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.createParcel);
router.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.cancelParcel);
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelController.allParcel);
//  admin route
router.get("/all", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.getAllParcelByAdmin);
router.patch("/blocked/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.updateIsBlocked);
router.patch("/current-status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelController.updateCurrentStatus);
//  receiver route
router.get("/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.incomingParcel);
router.patch("/confirm-status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.confirmCurrentStatus);
router.get("/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelController.deliveryHistory);
router.get("/achievement", parcel_controller_1.ParcelController.achievement);
exports.ParcelRoute = router;
