import { model, Schema } from "mongoose";
import {
  AccountStatus,
  IAuthProvider,
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
      default: UserRole.RIDER,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);


export const User = model<IUser>("User", userSchema);
