"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = exports.calculateDistanceInKm = void 0;
const constants_1 = require("../constants");
const calculateDistanceInKm = (from, to) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(from.lat)) *
            Math.cos(toRad(to.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
};
exports.calculateDistanceInKm = calculateDistanceInKm;
const calculateFare = (from, to) => {
    const distanceKm = (0, exports.calculateDistanceInKm)(from, to);
    const baseFare = 0;
    return parseFloat((baseFare + distanceKm * constants_1.perKmRate).toFixed(2));
};
exports.calculateFare = calculateFare;
