import dotenv from "dotenv";
dotenv.config();

type NodeEnvironment = "development" | "production";

interface EnvConfig {
  DB_URL: string;
  PORT: string;
  NODE_ENV: NodeEnvironment;
  SALT_VALUE: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  ACCESS_EXPIRES_IN: string;
  REFRESH_EXPIRES_IN:string;
  SUPER_ADMIN_EMAIL:string;
  SUPER_ADMIN_PASSWORD:string;
  SUPER_ADMIN_PHONE:string;
  SUPER_ADMIN_ADDRESS:string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL:string;
  EXPRESS_SESSION_SECRET:string;
  FRONTEND_URL:string;
  
  // google maps
  GOOGLE_MAPS_URL:string;
  GOOGLE_MAPS_USER_AGENT:string;

  // SSL
  SSL_STORE_ID:string;
  SSL_STORE_PASS:string;
  SSL_PAYMENT_API:string;
  SSL_VALIDATION_API:string
  SSL_SUCCESS_BACKEND_URL:string;
  SSL_FAIL_BACKEND_URL:string;
  SSL_CANCEL_BACKEND_URL:string;
  SSL_SUCCESS_FRONTEND_URL:string;
  SSL_FAIL_FRONTEND_URL:string;
  SSL_CANCEL_FRONTEND_URL:string;
  SSL_IPN_URL:string;
  // CLOUDINARY
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  // SMTP
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
  SMTP_CONNECTION_TIMEOUT: string;
  // Redis
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD: string;
  REDIS_USERNAME: string;
}

const isValidNodeEnv = (nodeEnv: string): nodeEnv is NodeEnvironment =>
  nodeEnv === "development" || nodeEnv === "production";

const requiredEnvVariables: (keyof EnvConfig)[] = [
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
  "GOOGLE_MAPS_URL",
  "GOOGLE_MAPS_USER_AGENT",
  // SSL
  "SSL_STORE_ID",
  "SSL_STORE_PASS",
  "SSL_PAYMENT_API",
  "SSL_VALIDATION_API",
  "SSL_SUCCESS_BACKEND_URL",
  "SSL_FAIL_BACKEND_URL",
  "SSL_CANCEL_BACKEND_URL",
  "SSL_SUCCESS_FRONTEND_URL",
  "SSL_FAIL_FRONTEND_URL",
  "SSL_CANCEL_FRONTEND_URL",
  "SSL_IPN_URL",

  // CLOUDINARY
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  // SMTP
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "SMTP_CONNECTION_TIMEOUT",

  // Redis
  "REDIS_HOST",
  "REDIS_PORT",
  "REDIS_PASSWORD",
  "REDIS_USERNAME"
];

const loadEnvVariables = (): EnvConfig => {
  const config: Partial<EnvConfig> = {};

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
    } else {
      config[key] = value;
    }
  });

  return config as EnvConfig;
};

export const envVars = loadEnvVariables();