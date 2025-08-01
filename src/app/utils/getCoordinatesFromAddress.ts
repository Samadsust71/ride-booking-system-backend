/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env.config";

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const url = `${envVars.NOMINATIM_BASE_URL}=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": envVars.GOOGLE_MAPS_USER_AGENT || "ride-booking-app",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch. Status: ${res.status}`);
    }

    const data: any = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
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

export const getReadableAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const url = `${envVars.NOMINATIM_REVERSE_URL}?lat=${lat}&lon=${lng}&format=json`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": envVars.GOOGLE_MAPS_USER_AGENT || "ride-booking-app",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch address. Status: ${res.status}`);
    }

    const data: any = await res.json();

    if (!data.display_name) {
      throw new Error("Address not found");
    }

    return data.display_name; 
  } catch (error: any) {
    throw new AppError(400, `Error fetching address: ${error.message}`);
  }
};
