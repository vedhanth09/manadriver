import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getNotifications, markAllRead } from "../controllers/notifications.controller";

const router = Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read", authMiddleware, markAllRead);

export default router;
