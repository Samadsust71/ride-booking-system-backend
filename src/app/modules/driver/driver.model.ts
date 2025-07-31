import { Schema, model } from 'mongoose';
import { IDriver, IsApprove, IsAvailable } from './driver.interface';

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: IsApprove,
      default: IsApprove.PENDING,
    },
    availabilityStatus: {
      type: String,
      enum: IsAvailable,
      default: IsAvailable.OFFLINE,
    },
    earnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Driver = model<IDriver>('Driver', driverSchema);