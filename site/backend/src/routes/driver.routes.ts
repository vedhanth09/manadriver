import { Router } from "express";
import {
  getProfile,
  createProfile,
  updateProfile,
  uploadDocuments,
} from "../controllers/driver.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware, requireRole("driver"));

router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.patch("/profile", updateProfile);
router.post(
  "/documents",
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "license", maxCount: 1 },
  ]),
  uploadDocuments
);

export default router;
