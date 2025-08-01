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
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const index_helpers_1 = require("../helpers/index.helpers");
const env_config_1 = require("../config/env.config");
const globalErrorHandler = (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (env_config_1.envVars.NODE_ENV === "development") {
        console.log(error);
    }
    let statusCode = 500;
    let message = `Something went wrong`;
    let errorSources = [];
    //Duplicate error
    if (error.code === 11000) {
        const simplifiedError = (0, index_helpers_1.handlerDuplicateError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Object ID error / Cast Error
    else if (error.name === "CastError") {
        const simplifiedError = (0, index_helpers_1.handleCastError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (error.name === "ZodError") {
        const simplifiedError = (0, index_helpers_1.handlerZodError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    //Mongoose Validation Error
    else if (error.name === "ValidationError") {
        const simplifiedError = (0, index_helpers_1.handlerValidationError)(error);
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources;
        message = simplifiedError.message;
    }
    else if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof Error) {
        statusCode = 500;
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: env_config_1.envVars.NODE_ENV === "development" ? error : null,
        stack: env_config_1.envVars.NODE_ENV === "development" ? error.stack : null,
    });
});
exports.globalErrorHandler = globalErrorHandler;
