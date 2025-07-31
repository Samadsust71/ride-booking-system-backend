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
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  SUSPENDED = "SUSPENDED",
}

 

export interface IAuthProvider {
  provider: "google"|"credentials";
  providerId: string;
}

/**
 * Main user interface 
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: UserRole;
  isDeleted?: boolean;
  isVerified: boolean;
  status: AccountStatus;
  auths: IAuthProvider[];
  rides?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
