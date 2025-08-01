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
exports.getReadableAddressFromCoordinates = exports.getCoordinatesFromAddress = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const env_config_1 = require("../config/env.config");
// Address → Coordinates
const getCoordinatesFromAddress = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `https://us1.locationiq.com/v1/search?key=${env_config_1.envVars.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`;
        const { data } = yield axios_1.default.get(url);
        if (!Array.isArray(data) || !data.length) {
            throw new Error("Address not found");
        }
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
    }
    catch (error) {
        throw new AppError_1.default(400, `Failed to get coordinates. Are you sure it's a valid address?`);
    }
});
exports.getCoordinatesFromAddress = getCoordinatesFromAddress;
// Coordinates → Address
const getReadableAddressFromCoordinates = (lat, lng) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `https://us1.locationiq.com/v1/reverse?key=${env_config_1.envVars.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
        const { data } = yield axios_1.default.get(url);
        if (!data.display_name) {
            throw new Error("Address not found");
        }
        return data.display_name;
    }
    catch (error) {
        throw new AppError_1.default(400, `Failed to get address. Are you sure it's a valid address?`);
    }
});
exports.getReadableAddressFromCoordinates = getReadableAddressFromCoordinates;
