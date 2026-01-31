export const subjectiveCreditLimit = (income) => {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return 200000; // subjective high limit
};

export const generateCreditScore = () => {
  return Math.floor(650 + Math.random() * 200); // 650–850
};
