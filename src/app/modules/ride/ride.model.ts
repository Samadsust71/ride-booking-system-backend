import { Schema, model, Types } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";
import { perKmRate } from "../../constants";

const rideSchema = new Schema(
  {
    rider: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.REQUESTED,
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
      default: perKmRate, 
    },
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
