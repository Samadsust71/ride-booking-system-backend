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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = exports.findNearbyDrivers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const getCoordinatesFromAddress_1 = require("../../utils/getCoordinatesFromAddress");
const calculateFare_1 = require("../../utils/calculateFare");
const driver_model_1 = require("../driver/driver.model");
const createRide = (riderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!riderId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized access");
    }
    const existingRide = yield ride_model_1.Ride.findOne({
        rider: riderId,
        status: {
            $in: [
                ride_interface_1.RideStatus.REQUESTED,
                ride_interface_1.RideStatus.ACCEPTED,
                ride_interface_1.RideStatus.PICKED_UP,
                ride_interface_1.RideStatus.IN_TRANSIT,
            ],
        },
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an active ride in progress");
    }
    if (!payload.pickupLocation || !payload.destinationLocation) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup and destination locations are required");
    }
    const pickupCoords = yield (0, getCoordinatesFromAddress_1.getCoordinatesFromAddress)(payload.pickupLocation);
    const destinationCoords = yield (0, getCoordinatesFromAddress_1.getCoordinatesFromAddress)(payload.destinationLocation);
    const distance = (0, calculateFare_1.calculateDistanceInKm)(pickupCoords, destinationCoords);
    if (distance <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup and destination locations cannot be the same");
    }
    if (!pickupCoords || !destinationCoords) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid pickup or destination address");
    }
    const totalFare = (0, calculateFare_1.calculateFare)(pickupCoords, destinationCoords);
    if (isNaN(totalFare) || totalFare < 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid fare calculation for the ride");
    }
    const ridePayload = {
        rider: riderId,
        pickupLocation: payload.pickupLocation,
        destinationLocation: payload.destinationLocation,
        fare: totalFare,
        distance: distance,
        status: ride_interface_1.RideStatus.REQUESTED,
        isPaid: false,
        timestamps: {
            requestedAt: new Date(),
        },
    };
    const ride = yield ride_model_1.Ride.create(ridePayload);
    return ride;
});
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, mongoose_1.isValidObjectId)(rideId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid ride ID");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.rider.toString() !== riderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to cancel this ride");
    }
    if (ride.status !== ride_interface_1.RideStatus.REQUESTED &&
        ride.status !== ride_interface_1.RideStatus.ACCEPTED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel a ride at '${ride.status}' stage`);
    }
    ride.status = ride_interface_1.RideStatus.CANCELLED;
    ride.timestamps.cancelledAt = new Date();
    yield ride.save();
    return ride;
});
const getMyRides = (riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find({ rider: riderId }).sort({ createdAt: -1 });
    return rides;
});
const getSingleRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, mongoose_1.isValidObjectId)(rideId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid ride ID");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.rider.toString() !== riderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this ride");
    }
    return ride;
});
const feedbackRide = (rideId, riderId, rating, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, mongoose_1.isValidObjectId)(rideId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid ride ID");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.rider.toString() !== riderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to provide feedback for this ride");
    }
    if (ride.status !== ride_interface_1.RideStatus.COMPLETED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Feedback can only be provided for completed rides");
    }
    if (rating < 1 || rating > 5) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Rating must be between 1 and 5");
    }
    if (!feedback || feedback.trim() === "") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Feedback cannot be empty");
    }
    if (ride.rating !== undefined || ride.feedback !== undefined) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Feedback has already been submitted for this ride");
    }
    ride.rating = rating;
    ride.feedback = feedback;
    yield ride.save();
    return ride;
});
const findNearbyDrivers = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, lat, lng } = payload;
    let coordinates = { lat, lng };
    if (address && (!lat || !lng)) {
        coordinates = yield (0, getCoordinatesFromAddress_1.getCoordinatesFromAddress)(address);
    }
    if (!coordinates.lat || !coordinates.lng) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coordinates or address required");
    }
    const drivers = yield driver_model_1.Driver.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat],
                },
                $maxDistance: 3000,
            },
        },
        availabilityStatus: "ONLINE",
        approvalStatus: "APPROVED",
    }).populate("user", "name email phoneNumber");
    const formattedDrivers = yield Promise.all(drivers.map((driver) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        let locationString = "";
        if (((_b = (_a = driver.location) === null || _a === void 0 ? void 0 : _a.coordinates) === null || _b === void 0 ? void 0 : _b.length) === 2) {
            const [lng, lat] = driver.location.coordinates;
            locationString = yield (0, getCoordinatesFromAddress_1.getReadableAddressFromCoordinates)(lat, lng);
        }
        return {
            name: driver.user.name || null,
            email: driver.user.email || null,
            phoneNumber: driver.user.phoneNumber || null,
            location: locationString,
        };
    })));
    return formattedDrivers;
});
exports.findNearbyDrivers = findNearbyDrivers;
exports.RideService = {
    createRide,
    cancelRide,
    getMyRides,
    getSingleRide,
    feedbackRide,
    findNearbyDrivers: exports.findNearbyDrivers
};
