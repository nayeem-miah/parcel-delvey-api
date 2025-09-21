"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = require("./app/routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://parcel-delevary-client.vercel.app"],
    credentials: true
}));
// router 
app.use("/api/v1", routes_1.router);
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        timestamp: new Date().toString(),
        message: "Welcome to parcel delivery backend"
    });
});
// global error
app.use(globalErrorHandler_1.default);
// not fount page
app.use(notFound_1.default);
exports.default = app;
/**
 * project modular mvc pattern
 * todo 1 : create user (role base by default ---> sender or receiver)
 * todo 2 : manually admin create
 * todo 3 : create parcel--> admin role and sender role
 */ 
