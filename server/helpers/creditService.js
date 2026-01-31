import crypto from "crypto";

export const subjectiveCreditLimit = (income) => {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return 200000; // subjective high limit
};

export const fetchCreditScore = () => {
  return Math.floor(650 + Math.random() * 250);
};

export const calculateCreditLimit = (income) => {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return null;
};

export const encryptPAN = (pan) => {
  if (!pan) throw new Error("PAN is required");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PAN_SECRET_KEY, "hex"),
    Buffer.from(process.env.PAN_IV, "hex"),
  );
  let encrypted = cipher.update(pan, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptPAN = (encryptedPan) => {
  if (!encryptedPan) throw new Error("Encrypted PAN is required");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.PAN_SECRET_KEY, "hex"),
    Buffer.from(process.env.PAN_IV, "hex"),
  );
  let decrypted = decipher.update(encryptedPan, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
