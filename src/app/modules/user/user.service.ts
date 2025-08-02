import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env.config";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
   const { email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
     const hashedPassword = await bcrypt.hash(password as string, Number(envVars.SALT_VALUE));

     const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user

}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
   
    if (decodedToken.role === UserRole.ADMIN && ifUserExist.role === UserRole.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
    }

    if (payload.role) {
        if (decodedToken.role === UserRole.RIDER || decodedToken.role === UserRole.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.status || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === UserRole.RIDER || decodedToken.role === UserRole.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.SALT_VALUE))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}



export const UserServices = {
    createUser,
     updateUser
}