"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const driverSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    vehicleModel: {
        type: String,
    },
    vehicleNumber: {
        type: String,
        required: true,
    },
    approvalStatus: {
        type: String,
        enum: driver_interface_1.IsApprove,
        default: driver_interface_1.IsApprove.PENDING,
    },
    availabilityStatus: {
        type: String,
        enum: driver_interface_1.IsAvailable,
        default: driver_interface_1.IsAvailable.OFFLINE,
    },
    drivingLocation: { type: String },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number]
        },
    },
    earnings: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
driverSchema.index({ location: '2dsphere' });
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
