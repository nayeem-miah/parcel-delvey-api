"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFrr = void 0;
const calculateFrr = (width) => {
    const widthPerKg = 2;
    return Math.ceil(width) * widthPerKg;
};
exports.calculateFrr = calculateFrr;
