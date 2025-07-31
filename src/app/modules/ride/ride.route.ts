import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.interface";
import { createRideZodSchema } from "./ride.validation";
import { RideController } from "./ride.controller";


const router = Router();

router.post("/request", checkAuth(UserRole.RIDER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
 validateRequest(createRideZodSchema),
  RideController.createRide)
  router.get("/me", checkAuth(UserRole.RIDER), RideController.getMyRides)
  router.patch("/:id/cancel", checkAuth(UserRole.RIDER), RideController.cancelRide)
  router.get("/:id", checkAuth(UserRole.RIDER), RideController.getSingleRide)

export const RideRoutes = router;