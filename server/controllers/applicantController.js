import {
  calculateCreditLimit,
  encryptPAN,
  fetchCreditScore,
} from "../helpers/creditService.js";
import Application from "../models/Application.js";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export const applicant = async (req, res) => {
  try {
    const { name, dob, phone, pan, annualIncome } = req.body;

    // Basic validation
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!dob) return res.status(400).json({ message: "DOB is required" });
    if (!phone) return res.status(400).json({ message: "Phone is required" });
    if (!pan) return res.status(400).json({ message: "PAN is required" });
    if (!annualIncome)
      return res.status(400).json({ message: "Annual Income is required" });

    // Age validation
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18)
      return res.status(400).json({ message: "Applicant must be 18+" });

    // 6 months validation
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const existing = await Application.findOne({
      phone,
      createdAt: { $gte: sixMonthsAgo },
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "Application already submitted in last 6 months" });

    const creditScore = fetchCreditScore();
    const creditLimit = calculateCreditLimit(Number(annualIncome));
    const encryptedPan = encryptPAN(pan);

    // Save application
    const application = await Application.create({
      applicationNumber: uuid(),
      fullName: name,
      dob,
      phoneNumber: phone,
      panCard: encryptedPan,
      annualIncome: Number(annualIncome),
      creditScore,
      creditLimit,
      status: "PENDING",
      createdAt: new Date(),
    });

    res.json({
      message: "Application submitted successfully",
      applicationNumber: application.applicationNumber,
    });
  } catch (err) {
    console.error("Error saving application:", err);
    res.status(500).json({ message: err.message });
  }
};

export const checkStatus = async (req, res) => {
  try {
    const app = await Application.findOne({ applicationNumber: req.params.id });

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Unexpected error" });
  }
};
