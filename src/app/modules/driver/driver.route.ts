import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { DriverController } from "./driver.controller";
import { createDriverZodSchema } from "./driver.validation";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post("/apply-driver", checkAuth(UserRole.RIDER), validateRequest(createDriverZodSchema), DriverController.applyToBeDriver);
router.get("/rides-available", checkAuth(UserRole.DRIVER), DriverController.getAvailableRides);
router.get("/earning-history", checkAuth(UserRole.DRIVER), DriverController.getRideHistory);
router.patch("/:id/accept", checkAuth(UserRole.DRIVER), DriverController.acceptRide);
router.patch("/:id/reject", checkAuth(UserRole.DRIVER), DriverController.rejectRide);
router.patch("/:id/status", checkAuth(UserRole.DRIVER), DriverController.updateRideStatus);

export const DriverRoutes = router;