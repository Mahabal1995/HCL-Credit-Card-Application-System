export const subjectiveCreditLimit = (income) => {
  if (income <= 200000) return 50000;
  if (income <= 300000) return 75000;
  if (income <= 500000) return 100000;
  return 200000; // subjective high limit
};
const normalizePan = (pan) => pan?.toUpperCase();
export const generateCreditScore = (pan) => {
  const normalizedPan = normalizePan(pan);
  let hash = 0;

  for (const ch of normalizedPan) {
    hash += ch.charCodeAt(0);
  }

  const score = 300 + (hash % 601);
  return score;
};
