"use strict";
/* eslint-disable no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const env_config_1 = require("../config/env.config");
const user_interface_1 = require("../modules/user/user.interface");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../modules/user/user.model");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isSuperAdminExists = yield user_model_1.User.findOne({ email: env_config_1.envVars.SUPER_ADMIN_EMAIL });
    if (isSuperAdminExists) {
        console.log("Super Admin already exists");
        return;
    }
    console.log("Seeding Super Admin...");
    const hashedPassword = yield bcryptjs_1.default.hash(env_config_1.envVars.SUPER_ADMIN_PASSWORD, parseInt(env_config_1.envVars.SALT_VALUE));
    const authProvider = {
        provider: "credentials",
        providerId: env_config_1.envVars.SUPER_ADMIN_EMAIL,
    };
    const payload = {
        name: "Super Admin",
        email: env_config_1.envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: user_interface_1.UserRole.SUPER_ADMIN,
        address: env_config_1.envVars.SUPER_ADMIN_ADDRESS,
        isDeleted: false,
        auths: [authProvider],
        isVerified: true,
        status: user_interface_1.AccountStatus.ACTIVE,
        phone: env_config_1.envVars.SUPER_ADMIN_PHONE,
    };
    const superAdmin = yield user_model_1.User.create(payload);
    console.log(`Super Admin created with ID: ${superAdmin._id}`);
});
exports.seedSuperAdmin = seedSuperAdmin;
