/* eslint-disable no-console */

import { envVars } from "../config/env.config";
import { AccountStatus, IAuthProvider, IUser, UserRole } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";
import { User } from "../modules/user/user.model";
export const seedSuperAdmin = async () => {
    const isSuperAdminExists = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

    if (isSuperAdminExists) {
        console.log("Super Admin already exists");
        return;
    }

    console.log("Seeding Super Admin...");
    const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, parseInt(envVars.SALT_VALUE));

    const authProvider :IAuthProvider = {
        provider:"credentials",
        providerId: envVars.SUPER_ADMIN_EMAIL,
    }

    const payload:Partial<IUser> = {
        name: "Super Admin",
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        auths:[authProvider],
        isVerified:true,
        status: AccountStatus.ACTIVE,
        phone: envVars.SUPER_ADMIN_PHONE,

    }
    const superAdmin = await User.create(payload);
    console.log(`Super Admin created with ID: ${superAdmin._id}`);
}