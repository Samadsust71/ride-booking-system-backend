"use strict";
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
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../modules/user/user.model");
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("../modules/user/user.interface");
const env_config_1 = require("./env.config");
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done("User does not exist");
        }
        // if (!isUserExist.isVerified) {
        //   return done("User is not verified");
        // }
        if (isUserExist.status === user_interface_1.AccountStatus.BLOCKED ||
            isUserExist.status === user_interface_1.AccountStatus.SUSPENDED) {
            return done(`User is ${isUserExist.status}`);
        }
        if (isUserExist.isDeleted) {
            return done("User is deleted");
        }
        const isGoogleAuthenticated = isUserExist.auths.some((auth) => auth.provider === "google");
        if (isGoogleAuthenticated && !isUserExist.password) {
            return done("You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password.");
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatch) {
            return done("Password is incorrect");
        }
        return done(null, isUserExist);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during local authentication:", error);
        return done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_config_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_config_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return done(null, false, {
                message: "Email not found in Google profile",
            });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (user && !user.isVerified) {
            return done(null, false, { message: "User is not verified" });
        }
        if (user &&
            (user.status === user_interface_1.AccountStatus.BLOCKED ||
                user.status === user_interface_1.AccountStatus.SUSPENDED)) {
            return done(`User is ${user.status}`);
        }
        if (user && user.isDeleted) {
            return done(null, false, { message: "User is deleted" });
        }
        if (!user) {
            user = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                role: user_interface_1.UserRole.RIDER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
        }
        return done(null, user);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during Google authentication:", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    return done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        return done(null, user);
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during user deserialization:", error);
        return done(error);
    }
}));
