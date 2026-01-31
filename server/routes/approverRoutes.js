import express from "express";
const router = express.Router();

import {
  getAllApplications,
  getApplicationDetails,
  getApplicantHistory,
  approveApplication,
  rejectApplication,
  subjectiveLimitCheck,
  createCreditScore,
} from "../controllers/approverController.js";

import { protectApprover } from "../middleware/authMiddleware.js";

// Protect Approver APIs
router.use(protectApprover);

router.get("/applications", getAllApplications);
router.get("/applications/:id", getApplicationDetails);

router.get("/history/:pan", getApplicantHistory);
router.post("/approve/:id", approveApplication);
router.post("/reject/:id", rejectApplication);

router.post("/subjective-limit", subjectiveLimitCheck);
router.get("/credirscore/:pan", createCreditScore);

export default router;
