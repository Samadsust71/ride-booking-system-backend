import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { AdminController } from "./admin.controller";

const router = Router();



router.get("/users", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.getAllUsers);
router.get("/drivers", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.getAllDrivers);
router.get("/rides", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.getAllRides);
router.get("/report", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.getAdminReport);

router.patch("/driver/approve/:id", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.approveDriver);
router.patch("/driver/suspend/:id", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.suspendDriver);
router.patch("/user/block/:id", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.blockUser);
router.patch("/user/unblock/:id", checkAuth(UserRole.SUPER_ADMIN,UserRole.ADMIN), AdminController.unblockUser);

export const AdminRoutes = router;