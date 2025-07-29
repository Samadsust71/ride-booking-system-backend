import { Document, Types } from "mongoose";

/**
 * Enum for user roles
 */
export enum UserRole {
  ADMIN = "admin",
  RIDER = "rider",
  DRIVER = "driver",
}

/**
 * Enum for account status
 */
export enum AccountStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
  SUSPENDED = "suspended",
}

/**
 * Enum for driver approval status
 */
export enum DriverApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
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
  role: UserRole;
  status: AccountStatus;
  driverInfo?: IDriverInfo;
  createdAt?: Date;
  updatedAt?: Date;
}
