import express from "express";
import { applicant, checkStatus } from "../controllers/applicantController.js";
const router = express.Router();

router.post("/", applicant);
router.get("/:id", checkStatus);

export default router;
