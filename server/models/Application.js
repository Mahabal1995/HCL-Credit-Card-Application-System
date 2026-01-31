import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    panCard: {
      type: String,
      required: true,
    },

    age: Number,
    annualIncome: Number,

    creditScore: {
      type: Number,
      default: 0,
    },

    creditLimit: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
