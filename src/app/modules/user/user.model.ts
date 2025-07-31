import { model, Schema } from "mongoose";
import {
  AccountStatus,
  DriverApprovalStatus,
  IAuthProvider,
  IDriverInfo,
  IUser,
  UserRole,
} from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

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
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
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
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
    isVerified: { type: Boolean, default: false },
    driverInfo: { type: driverInfoSchema, required: false }
  },
  { timestamps: true, versionKey: false }
);

/**
 * Index for fast driver search (optional but recommended)
 */
// userSchema.index({ role: 1, "driverInfo.isOnline": 1 });

export const User = model<IUser>("User", userSchema);
