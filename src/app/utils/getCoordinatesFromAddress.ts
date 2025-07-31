/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import AppError from "../errorHelpers/AppError";
import { envVars } from "../config/env.config";

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const url = `${envVars.GOOGLE_MAPS_URL}=${encodeURIComponent(
      address
    )}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": envVars.GOOGLE_MAPS_USER_AGENT,
      },
    });

    const data: any = await res.json();
    if (!data || data.length === 0) {
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
