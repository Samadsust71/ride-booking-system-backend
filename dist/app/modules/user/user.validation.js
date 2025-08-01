"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
/**
 * Zod enum conversion helper
 */
const userRoleEnum = zod_1.z.enum([user_interface_1.UserRole.SUPER_ADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.RIDER, user_interface_1.UserRole.DRIVER], {
    required_error: "Role is required",
    invalid_type_error: "Role must be one of admin, rider, or driver",
});
const accountStatusEnum = zod_1.z.enum([user_interface_1.AccountStatus.ACTIVE, user_interface_1.AccountStatus.INACTIVE, user_interface_1.AccountStatus.BLOCKED, user_interface_1.AccountStatus.SUSPENDED], {
    invalid_type_error: "Invalid account status",
});
/**
 * Create User Validation Schema
 */
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),
    email: zod_1.z
        .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 characters long" })
        .max(100, { message: "Email cannot exceed 100 characters" }),
    password: zod_1.z
        .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    })
        .min(6, { message: "Password must be at least 6 characters long" }).optional(),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh (+8801XXXXXXXXX or 01XXXXXXXXX)",
    })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
});
/**
 * Update User Validation Schema
 */
exports.updateUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "Name must be a string" })
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" })
        .optional(),
    password: zod_1.z
        .string({ invalid_type_error: "Password must be a string" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .optional(),
    phone: zod_1.z
        .string({ invalid_type_error: "Phone number must be a string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh (+8801XXXXXXXXX or 01XXXXXXXXX)",
    })
        .optional(),
    isDeleted: zod_1.z
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional(),
    isVerified: zod_1.z
        .boolean({ invalid_type_error: "isVerified must be true or false" })
        .optional(),
    address: zod_1.z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    picture: zod_1.z.string({ invalid_type_error: "Picture must be a string" }).optional(),
    role: userRoleEnum.optional(),
    status: accountStatusEnum.optional(),
});
