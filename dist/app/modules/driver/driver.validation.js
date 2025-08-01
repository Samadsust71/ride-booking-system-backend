"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDriverZodSchema = void 0;
const zod_1 = require("zod");
exports.createDriverZodSchema = zod_1.z.object({
    vehicleType: zod_1.z.string({
        message: "Vehicle type is required",
    }),
    vehicleModel: zod_1.z.string().optional(),
    vehicleNumber: zod_1.z.string({
        message: "Vehicle number is required",
    }),
    drivingLocation: zod_1.z.string({
        message: "Driving Location Required",
    }),
});
