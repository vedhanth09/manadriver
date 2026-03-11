import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createRating,
  getDriverRatings,
  getMySubmittedRatings,
} from "../controllers/ratings.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/ratings — create a new rating
router.post("/", createRating);

// GET /api/ratings/mine — get job IDs the current user has already rated
router.get("/mine", getMySubmittedRatings);

// GET /api/ratings/driver/:driverId — get all ratings for a driver
router.get("/driver/:driverId", getDriverRatings);

export default router;
