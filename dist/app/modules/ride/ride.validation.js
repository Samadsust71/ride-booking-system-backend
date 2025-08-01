"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideZodSchema = void 0;
const zod_1 = require("zod");
exports.createRideZodSchema = zod_1.z.object({
    pickupLocation: zod_1.z.string({ message: "Pickup address is required" }),
    destinationLocation: zod_1.z.string({ message: "Destination address is required" })
});
