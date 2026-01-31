import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  panCard: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  annualIncome: { type: Number, required: true },
  creditScore: { type: Number },
  creditLimit: { type: Number },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;