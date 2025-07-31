/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { AccountStatus, UserRole } from "../modules/user/user.interface";
import { envVars } from "./env.config";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });

        if (!isUserExist) {
          return done("User does not exist");
        }
        // if (!isUserExist.isVerified) {
        //   return done("User is not verified");
        // }

        if (
          isUserExist.status === AccountStatus.BLOCKED ||
          isUserExist.status === AccountStatus.SUSPENDED
        ) {
          return done(`User is ${isUserExist.status}`);
        }
        if (isUserExist.isDeleted) {
         
          return done("User is deleted");
        }

        const isGoogleAuthenticated = isUserExist.auths.some(
          (auth) => auth.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(
            "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password."
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          password,
          isUserExist.password as string
        );

        if (!isPasswordMatch) {
          return done("Password is incorrect");
        }

        return done(null, isUserExist);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during local authentication:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, {
            message: "Email not found in Google profile",
          });
        }

        let user = await User.findOne({ email });

        if (user && !user.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }

        if (
          user &&
          (user.status === AccountStatus.BLOCKED ||
            user.status === AccountStatus.SUSPENDED)
        ) {
          return done(`User is ${user.status}`);
        }

        if (user && user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: UserRole.RIDER,
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error during Google authentication:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  return done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error during user deserialization:", error);
    return done(error);
  }
});