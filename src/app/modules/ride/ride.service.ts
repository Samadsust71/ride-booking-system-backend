import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { isValidObjectId } from "mongoose";
import { getCoordinatesFromAddress } from "../../utils/getCoordinatesFromAddress";
import {
  calculateDistanceInKm,
  calculateFare,
} from "../../utils/calculateFare";

const createRide = async (riderId: string, payload: Partial<IRide>) => {
  if (!riderId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const existingRide = await Ride.findOne({
    rider: riderId,
    status: {
      $in: [
        RideStatus.REQUESTED,
        RideStatus.ACCEPTED,
        RideStatus.PICKED_UP,
        RideStatus.IN_TRANSIT,
      ],
    },
  });

  if (existingRide) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have an active ride in progress"
    );
  }
  if (!payload.pickupLocation || !payload.destinationLocation) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pickup and destination locations are required"
    );
  }

  const pickupCoords = await getCoordinatesFromAddress(payload.pickupLocation);
  const destinationCoords = await getCoordinatesFromAddress(
    payload.destinationLocation
  );
  const distance = calculateDistanceInKm(pickupCoords, destinationCoords);
  if (distance <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Pickup and destination locations cannot be the same"
    );
  }
  if (!pickupCoords || !destinationCoords) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid pickup or destination address"
    );
  }
  const totalFare = calculateFare(pickupCoords, destinationCoords);

  if (isNaN(totalFare) || totalFare < 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid fare calculation for the ride"
    );
  }

  const ridePayload = {
    rider: riderId,
    pickupLocation: payload.pickupLocation,
    destinationLocation: payload.destinationLocation,
    fare: totalFare,
    distance: distance,
    status: RideStatus.REQUESTED,
    isPaid: false,
    timestamps: {
      requestedAt: new Date(),
    },
  };
  const ride = await Ride.create(ridePayload);

  return ride;
};

const cancelRide = async (rideId: string, riderId: string) => {
  if (!isValidObjectId(rideId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride ID");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.rider.toString() !== riderId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to cancel this ride"
    );
  }

  if (
    ride.status !== RideStatus.REQUESTED &&
    ride.status !== RideStatus.ACCEPTED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot cancel a ride at '${ride.status}' stage`
    );
  }

  ride.status = RideStatus.CANCELLED;
  ride.timestamps.cancelledAt = new Date();

  await ride.save();

  return ride;
};

const getMyRides = async (riderId: string) => {
  const rides = await Ride.find({ rider: riderId }).sort({ createdAt: -1 });

  return rides;
};

const getSingleRide = async (rideId: string, riderId: string) => {
  if (!isValidObjectId(rideId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride ID");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.rider.toString() !== riderId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this ride"
    );
  }

  return ride;
};

const feedbackRide = async (rideId: string, riderId: string, rating: number, feedback: string) => {
  if (!isValidObjectId(rideId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride ID");
  }

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (ride.rider.toString() !== riderId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to provide feedback for this ride"
    );
  }

  if (ride.status !== RideStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Feedback can only be provided for completed rides"
    );
  }
  
  if (rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }
  if (!feedback || feedback.trim() === "") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Feedback cannot be empty"
    );
  }
  if (ride.rating !== undefined || ride.feedback !== undefined) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Feedback has already been submitted for this ride"
    );
  }

  ride.rating = rating;
  ride.feedback = feedback;

  await ride.save();

  return ride;
};

export const RideService = {
  createRide,
  cancelRide,
  getMyRides,
  getSingleRide,
  feedbackRide,
};
