import { model, Schema } from "mongoose";
import {
  AccountStatus,
  DriverApprovalStatus,
  IDriverInfo,
  IUser,
  UserRole,
} from "./user.interface";

const driverInfoSchema = new Schema<IDriverInfo>(
  {
    approvalStatus: {
      type: String,
      enum: Object.values(DriverApprovalStatus),
      default: DriverApprovalStatus.PENDING,
    },
    isOnline: { type: Boolean, default: false },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
    totalEarnings: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false }
);

/**
 * User Schema
 */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },

    driverInfo: { type: driverInfoSchema, required: false },
  },
  { timestamps: true, versionKey: false }
);

/**
 * Index for fast driver search (optional but recommended)
 */
// userSchema.index({ role: 1, "driverInfo.isOnline": 1 });

export const User = model<IUser>("User", userSchema);
