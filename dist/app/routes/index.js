"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
exports.router = (0, express_1.Router)();
const modelerRouters = [
    {
        path: "/user",
        route: user_route_1.UserRouter
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/parcels",
        route: parcel_route_1.ParcelRoute
    },
];
modelerRouters.forEach((route) => {
    exports.router.use(route.path, route.route);
});
