import { Document, Types } from "mongoose";

/**
 * Enum for user roles
 */
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

/**
 * Enum for account status
 */
export enum AccountStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
}

/**
 * Enum for driver approval status
 */
export enum DriverApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IAuthProvider {
  provider: "google"|"credentials";
  providerId: string;
}

/**
 * Driver-specific info
 */
export interface IDriverInfo {
  approvalStatus: DriverApprovalStatus;
  isOnline: boolean;
  vehicleId?: Types.ObjectId;
  totalEarnings: number;
}

/**
 * Main user interface 
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: UserRole;
  isDeleted?: boolean;
  isVerified: boolean;
  status: AccountStatus;
  auths: IAuthProvider[];
  driverInfo?: IDriverInfo;
  createdAt?: Date;
  updatedAt?: Date;
}
