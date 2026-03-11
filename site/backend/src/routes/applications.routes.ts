import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import {
  applyToJob,
  getDriverApplications,
  getJobApplicants,
  updateApplication,
} from "../controllers/applications.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/applications — driver applies to a job
router.post("/", requireRole("driver"), applyToJob);

// GET /api/applications/driver — driver sees their own applications
router.get("/driver", requireRole("driver"), getDriverApplications);

// GET /api/applications/job/:jobId — customer sees applicants for their job
router.get("/job/:jobId", requireRole("customer"), getJobApplicants);

// PATCH /api/applications/:id — customer hires / driver accepts or declines
router.patch("/:id", requireRole("driver", "customer"), updateApplication);

export default router;
