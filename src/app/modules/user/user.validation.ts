import { z } from "zod";
import {
  AccountStatus,
  DriverApprovalStatus,
  UserRole,
} from "./user.interface";

/**
 * Zod enum conversion helper
 */
const userRoleEnum = z.enum([UserRole.ADMIN, UserRole.RIDER, UserRole.DRIVER], {
  required_error: "Role is required",
  invalid_type_error: "Role must be one of admin, rider, or driver",
});

const accountStatusEnum = z.enum(
  [AccountStatus.ACTIVE, AccountStatus.BLOCKED, AccountStatus.SUSPENDED],
  {
    invalid_type_error: "Invalid account status",
  }
);

const driverApprovalStatusEnum = z.enum(
  [
    DriverApprovalStatus.PENDING,
    DriverApprovalStatus.APPROVED,
    DriverApprovalStatus.REJECTED,
  ],
  { invalid_type_error: "Invalid driver approval status" }
);

/**
 * Driver Info Schema (for validation)
 */
const driverInfoSchema = z.object({
  approvalStatus: driverApprovalStatusEnum.optional(),
  isOnline: z
    .boolean({ invalid_type_error: "isOnline must be a boolean" })
    .optional(),
  vehicleId: z
    .string({ invalid_type_error: "vehicleId must be a string" })
    .optional(), // MongoDB ObjectId as string
  totalEarnings: z
    .number({ invalid_type_error: "totalEarnings must be a number" })
    .optional(),
});

/**
 * Create User Validation Schema
 */
export const createUserZodSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters long" }),

  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh (+8801XXXXXXXXX or 01XXXXXXXXX)",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  role: userRoleEnum.optional(),
  status: accountStatusEnum.optional(),
  driverInfo: driverInfoSchema.optional(),
});

/**
 * Update User Validation Schema
 */
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),

  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone number must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh (+8801XXXXXXXXX or 01XXXXXXXXX)",
    })
    .optional(),
  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),

  role: userRoleEnum.optional(),
  status: accountStatusEnum.optional(),
  driverInfo: driverInfoSchema.optional(),
});
