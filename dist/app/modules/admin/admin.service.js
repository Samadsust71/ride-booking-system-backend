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
exports.AdminService = exports.generateAdminReport = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const driver_model_1 = require("../driver/driver.model");
const driver_interface_1 = require("../driver/driver.interface");
const user_model_1 = require("../user/user.model");
const ride_model_1 = require("../ride/ride.model");
const ride_interface_1 = require("../ride/ride.interface");
const user_interface_1 = require("../user/user.interface");
const approveDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDriver = yield driver_model_1.Driver.findById(driverId);
    if (!existingDriver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (existingDriver.approvalStatus === driver_interface_1.IsApprove.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already approved");
    }
    existingDriver.approvalStatus = driver_interface_1.IsApprove.APPROVED;
    yield existingDriver.save();
    yield user_model_1.User.findByIdAndUpdate(existingDriver.user, { role: user_interface_1.UserRole.DRIVER });
    return existingDriver;
});
const suspendDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDriver = yield driver_model_1.Driver.findById(driverId);
    if (!existingDriver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (existingDriver.approvalStatus === driver_interface_1.IsApprove.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver is already suspended");
    }
    existingDriver.approvalStatus = driver_interface_1.IsApprove.SUSPENDED;
    yield existingDriver.save();
    return existingDriver;
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (existingUser.status === user_interface_1.AccountStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already blocked");
    }
    existingUser.status = user_interface_1.AccountStatus.BLOCKED;
    yield existingUser.save();
    return existingUser;
});
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (existingUser.status === user_interface_1.AccountStatus.UNBLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is already unblocked");
    }
    existingUser.status = user_interface_1.AccountStatus.UNBLOCKED;
    yield existingUser.save();
    return existingUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find().select("-password");
});
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield driver_model_1.Driver.find().populate("user", "-password");
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ride_model_1.Ride.find().populate("rider", "-password").populate("driver");
});
const generateAdminReport = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalDriversPromise = driver_model_1.Driver.countDocuments();
    const totalRidesPromise = ride_model_1.Ride.countDocuments();
    const totalCompletedRidesPromise = ride_model_1.Ride.countDocuments({
        status: ride_interface_1.RideStatus.COMPLETED,
    });
    const totalOngoingRidesPromise = ride_model_1.Ride.countDocuments({
        status: { $in: [ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT] },
    });
    const earningsDataPromise = ride_model_1.Ride.aggregate([
        { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
        { $group: { _id: null, total: { $sum: "$fare" } } },
    ]);
    const topFiveDriversPromise = ride_model_1.Ride.aggregate([
        {
            $match: {
                rating: { $ne: null },
                status: ride_interface_1.RideStatus.COMPLETED,
            },
        },
        {
            $group: {
                _id: "$driver",
                avgRating: { $avg: "$rating" },
                totalRides: { $sum: 1 },
            },
        },
        { $sort: { avgRating: -1, totalRides: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "drivers",
                localField: "_id",
                foreignField: "_id",
                as: "driverProfile",
            },
        },
        { $unwind: "$driverProfile" },
        {
            $lookup: {
                from: "users",
                localField: "driverProfile.user",
                foreignField: "_id",
                as: "driverInfo",
            },
        },
        { $unwind: "$driverInfo" },
        {
            $project: {
                _id: 0,
                driverId: "$_id",
                name: "$driverInfo.name",
                email: "$driverInfo.email",
                avgRating: 1,
                totalRides: 1,
            },
        },
    ]);
    const [totalUsers, totalDrivers, totalRides, totalCompletedRides, totalOngoingRides, earningsData, topFiveDrivers,] = yield Promise.all([
        totalUsersPromise,
        totalDriversPromise,
        totalRidesPromise,
        totalCompletedRidesPromise,
        totalOngoingRidesPromise,
        earningsDataPromise,
        topFiveDriversPromise,
    ]);
    return {
        totalUsers,
        totalDrivers,
        totalRides,
        totalCompletedRides,
        totalOngoingRides,
        totalEarnings: ((_a = earningsData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        topFiveDrivers,
    };
});
exports.generateAdminReport = generateAdminReport;
exports.AdminService = {
    approveDriver,
    suspendDriver,
    blockUser,
    unblockUser,
    getAllUsers,
    getAllDrivers,
    getAllRides,
    generateAdminReport: exports.generateAdminReport,
};
