

// // import express from "express";
// // import { v4 as uuid } from "uuid";
// // import Application from "../models/Application.js";

// // const router = express.Router();

// // function fetchCreditScore() {
// //   return Math.floor(650 + Math.random() * 250);
// // }

// // function calculateCreditLimit(income) {
// //   if (income <= 200000) return 50000;
// //   if (income <= 300000) return 75000;
// //   if (income <= 500000) return 100000;
// //   return null;
// // }

// // function encryptPAN(pan) {
// //   const cipher = crypto.createCipheriv(
// //     'aes-256-cbc',
// //     Buffer.from(process.env.PAN_SECRET_KEY, 'hex'),
// //     Buffer.from(process.env.PAN_IV, 'hex')
// //   );
// //   let encrypted = cipher.update(pan, 'utf8', 'hex');
// //   encrypted += cipher.final('hex');
// //   return encrypted;
// // }

// // router.post('/', async (req, res) => {
// //   const { name, dob, phone, pan, annualIncome } = req.body;

// //   const age = new Date().getFullYear() - new Date(dob).getFullYear();
// //   if (age < 18) {
// //     return res.status(400).json({ message: 'Applicant must be 18+' });
// //   }

// //   const creditScore = fetchCreditScore();
// //   const creditLimit = calculateCreditLimit(annualIncome);
// //   const encryptedPan = encryptPAN(pan);
// //   const maskedPhone = phone.replace(/^(\d{2})\d{6}(\d{2})$/, '$1******$2');

// //   const application = await Application.create({
// //     applicationNumber: uuid(),
// //     name,
// //     dob,
// //     phone: maskedPhone,
// //     encryptedPan,
// //     annualIncome,
// //     creditScore,
// //     creditLimit,
// //     status: 'SUBMITTED'
// //   });

// //   res.json({ applicationNumber: application.applicationNumber });
// // });

// // export default router;

// import express from "express";
// import crypto from "crypto";
// import { v4 as uuid } from "uuid";
// import dotenv from "dotenv";
// import Application from "../models/Application.js";

// dotenv.config();

// const router = express.Router();

// // Helper functions
// function fetchCreditScore() {
//   return Math.floor(650 + Math.random() * 250);
// }

// function calculateCreditLimit(income) {
//   if (income <= 200000) return 50000;
//   if (income <= 300000) return 75000;
//   if (income <= 500000) return 100000;
//   return 150000;
// }

// function encryptPAN(pan) {
//   if (!process.env.PAN_SECRET_KEY || !process.env.PAN_IV) {
//     throw new Error("PAN_SECRET_KEY or PAN_IV is not defined in environment variables");
//   }

//   const cipher = crypto.createCipheriv(
//     "aes-256-cbc",
//     Buffer.from(process.env.PAN_SECRET_KEY, "hex"),
//     Buffer.from(process.env.PAN_IV, "hex")
//   );
//   let encrypted = cipher.update(pan, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// function maskPhone(phone) {
//   return phone.replace(/^(\d{2})\d{6}(\d{2})$/, "$1******$2");
// }

// // POST /applications
// router.post("/", async (req, res) => {
//   try {
//     const { name, dob, phone, pan, annualIncome } = req.body;

//     // Validation
//     if (!name || !dob || !phone || !pan || !annualIncome) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (new Date().getFullYear() - new Date(dob).getFullYear() < 18) {
//       return res.status(400).json({ message: "Applicant must be 18+" });
//     }

//     const existing = await Application.findOne({
//       phone: maskPhone(phone),
//       createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
//     });

//     console.log("Is Existing :.... ",existing)

//     if (existing) {
//       return res.status(400).json({
//         message: "Application already submitted in last 6 months"
//       });
//     }

//     const creditScore = fetchCreditScore();
//     const creditLimit = calculateCreditLimit(Number(annualIncome));
//     const encryptedPan = encryptPAN(pan);
//     const maskedPhoneNum = maskPhone(phone);

//     const application = await Application.create({
//       applicationNumber: uuid(),
//       fullName: name,
//       dob,
//       phoneNumber: maskedPhoneNum,
//       panCard: encryptedPan,
//       annualIncome: Number(annualIncome),
//       creditScore,
//       creditLimit,
//       status: "PENDING",
//       createdAt: new Date()
//     });

//     res.status(201).json({
//       message: "Application submitted successfully",
//       applicationNumber: application.applicationNumber
//     });
//   } catch (err) {
//     console.error("Error saving application:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;



import express from "express";
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import Application from "../models/Application.js";

const router = express.Router();

// Helper functions
function fetchCreditScore() {
  return Math.floor(650 + Math.random() * 250);
}

function calculateCreditLimit(income) {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return null;
}

function encryptPAN(pan) {
  if (!pan) throw new Error("PAN is required");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PAN_SECRET_KEY, "hex"),
    Buffer.from(process.env.PAN_IV, "hex")
  );
  let encrypted = cipher.update(pan, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// POST /applications
router.post("/", async (req, res) => {
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
});

export default router;