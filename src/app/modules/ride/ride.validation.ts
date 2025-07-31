import { z } from "zod";

export const createRideZodSchema = z.object({
  pickupLocation:  z.string({ message: "Pickup address is required" }),
  destinationLocation: z.string({ message: "Destination address is required" })
});
