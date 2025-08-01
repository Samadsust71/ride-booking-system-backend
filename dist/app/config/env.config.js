"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isValidNodeEnv = (nodeEnv) => nodeEnv === "development" || nodeEnv === "production";
const requiredEnvVariables = [
    "DB_URL",
    "NODE_ENV",
    "PORT",
    "SALT_VALUE",
    "JWT_ACCESS_SECRET",
    "ACCESS_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "REFRESH_EXPIRES_IN",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_PHONE",
    "SUPER_ADMIN_ADDRESS",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    // google maps
    "NOMINATIM_BASE_URL",
    "NOMINATIM_REVERSE_URL",
    "GOOGLE_MAPS_USER_AGENT",
    "GOOGLE_MAPS_API_KEY",
    "LOCATIONIQ_API_KEY"
];
const loadEnvVariables = () => {
    const config = {};
    requiredEnvVariables.forEach((key) => {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        if (key === "NODE_ENV") {
            if (!isValidNodeEnv(value)) {
                throw new Error(`Invalid NODE_ENV value: ${value}`);
            }
            config[key] = value;
        }
        else {
            config[key] = value;
        }
    });
    return config;
};
exports.envVars = loadEnvVariables();
