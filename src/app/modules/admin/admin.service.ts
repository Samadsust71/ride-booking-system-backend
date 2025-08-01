import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Driver } from "../driver/driver.model";
import { IsApprove } from "../driver/driver.interface";
import { User } from "../user/user.model";
import { Ride } from "../ride/ride.model";
import { IAdminReport } from "./admin.interface";
import { RideStatus } from "../ride/ride.interface";
import { AccountStatus, UserRole } from "../user/user.interface";

const approveDriver = async (driverId: string) => {
  const existingDriver = await Driver.findById(driverId);

  if (!existingDriver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (existingDriver.approvalStatus === IsApprove.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is already approved");
  }

  existingDriver.approvalStatus = IsApprove.APPROVED;
  await existingDriver.save();

  await User.findByIdAndUpdate(existingDriver.user, { role: UserRole.DRIVER });

  return existingDriver;
};

const suspendDriver = async (driverId: string) => {
  const existingDriver = await Driver.findById(driverId);

  if (!existingDriver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (existingDriver.approvalStatus === IsApprove.SUSPENDED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Driver is already suspended");
  }

  existingDriver.approvalStatus = IsApprove.SUSPENDED;
  await existingDriver.save();

  return existingDriver;
};

const blockUser = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.status === AccountStatus.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked");
  }

  existingUser.status = AccountStatus.BLOCKED;
  await existingUser.save();

  return existingUser;
};

const unblockUser = async (userId: string) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (existingUser.status === AccountStatus.UNBLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already unblocked");
  }

  existingUser.status = AccountStatus.UNBLOCKED;
  await existingUser.save();

  return existingUser;
};

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getAllDrivers = async () => {
  return await Driver.find().populate("user", "-password");
};

const getAllRides = async () => {
  return await Ride.find().populate("rider", "-password").populate("driver");
};

export const generateAdminReport = async (): Promise<IAdminReport> => {
  const totalUsersPromise = User.countDocuments();
  const totalDriversPromise = Driver.countDocuments();
  const totalRidesPromise = Ride.countDocuments();
  const totalCompletedRidesPromise = Ride.countDocuments({
    status: RideStatus.COMPLETED,
  });
  const totalOngoingRidesPromise = Ride.countDocuments({
    status: { $in: [RideStatus.PICKED_UP, RideStatus.IN_TRANSIT] },
  });

  const earningsDataPromise = Ride.aggregate([
    { $match: { status: RideStatus.COMPLETED } },
    { $group: { _id: null, total: { $sum: "$fare" } } },
  ]);
  const topFiveDriversPromise = Ride.aggregate([
    {
      $match: {
        rating: { $ne: null },
        status: RideStatus.COMPLETED,
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
  const [
    totalUsers,
    totalDrivers,
    totalRides,
    totalCompletedRides,
    totalOngoingRides,
    earningsData,
    topFiveDrivers,
  ] = await Promise.all([
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
    totalEarnings: earningsData[0]?.total || 0,
    topFiveDrivers,
  };
};

export const AdminService = {
  approveDriver,
  suspendDriver,
  blockUser,
  unblockUser,
  getAllUsers,
  getAllDrivers,
  getAllRides,
  generateAdminReport,
};
