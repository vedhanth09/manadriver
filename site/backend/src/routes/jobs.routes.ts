import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  createJob,
  getJobs,
  getJobById,
  updateJobStatus,
} from "../controllers/jobs.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/jobs — customer creates a job
router.post("/", requireRole("customer"), createJob);

// GET /api/jobs — driver browses jobs; customer sees own jobs
router.get("/", requireRole("driver", "customer"), getJobs);

// GET /api/jobs/:id — get job details
router.get("/:id", requireRole("driver", "customer"), getJobById);

// PATCH /api/jobs/:id/status — update job status
router.patch("/:id/status", requireRole("driver", "customer"), updateJobStatus);

export default router;
