import express from "express";
const router = express.Router();
import { getApplicationDetails } from "../controllers/approverController.js";

router.get("/applications/:id", getApplicationDetails);

export default router;
