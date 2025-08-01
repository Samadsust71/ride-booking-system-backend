"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const constants_1 = require("../../constants");
const rideSchema = new mongoose_1.Schema({
    rider: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driver: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        default: null,
    },
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    fare: {
        type: Number,
    },
    distance: {
        type: Number,
        required: true,
    },
    farePerKm: {
        type: Number,
        default: constants_1.perKmRate,
    },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    timestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        inTransitAt: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
