import Application from "../models/Application.js";
import {
  subjectiveCreditLimit,
  generateCreditScore,
} from "../helpers/creditService.js";


// ✅ TAB 1: List All Applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ TAB 1: View Application Details
export const getApplicationDetails = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ TAB 2: Applicant History by PAN
export const getApplicantHistory = async (req, res) => {
  try {
    const history = await Application.find({ panCard: req.params.pan });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ TAB 2: Approve Application
export const approveApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ message: "Not found" });

    // Credit Score + Limit Calculation
    app.creditScore = generateCreditScore();
    app.creditLimit = subjectiveCreditLimit(app.annualIncome);

    app.status = "APPROVED";

    await app.save();

    res.json({
      message: "✅ Approved successfully",
      creditScore: app.creditScore,
      creditLimit: app.creditLimit,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ TAB 2: Reject Application
export const rejectApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) return res.status(404).json({ message: "Not found" });

    app.status = "REJECTED";
    app.rejectionReason = req.body.reason || "Not eligible";

    await app.save();

    res.json({
      message: "❌ Application Rejected",
      reason: app.rejectionReason,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ TAB 3: Subjective Limit Calculator API
export const subjectiveLimitCheck = (req, res) => {
  const { income } = req.body;

  const limit = subjectiveCreditLimit(income);

  res.json({
    annualIncome: income,
    suggestedLimit: limit,
  });
};
