/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env.config";

// Address → Coordinates
export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const url = `https://us1.locationiq.com/v1/search?key=${envVars.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(address)}&format=json`;

    const { data } = await axios.get(url);

    if (!Array.isArray(data) || !data.length) {
      throw new Error("Address not found");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error: any) {
    throw new AppError(400, `Error fetching coordinates: ${error.message}`);
  }
};

// Coordinates → Address
export const getReadableAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const url = `https://us1.locationiq.com/v1/reverse?key=${envVars.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;

    const { data } = await axios.get(url);

    if (!data.display_name) {
      throw new Error("Address not found");
    }

    return data.display_name;
  } catch (error: any) {
    throw new AppError(400, `Error fetching address: ${error.message}`);
  }
};
