import { Router } from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/customer.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware, requireRole("customer"));

router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.patch("/profile", updateProfile);

export default router;
