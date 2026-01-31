import { useState } from "react";

interface LimitResult {
  annualIncome: number;
  suggestedLimit: number;
}

export default function LimitCalculatorTab() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<LimitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateLimit = async () => {
    if (!income.trim() || parseFloat(income) <= 0) {
      alert("Please enter a valid annual income");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("approverToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/approver/subjective-limit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ income: parseFloat(income) }),
        },
      );

      if (!res.ok) throw new Error("Failed to calculate limit");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculateLimit();
    }
  };

  return (
    <div className="limit-calculator-tab">
      <h2>Subjective Limit Calculator</h2>
      <div className="calculator-section">
        <div className="input-group">
          <label htmlFor="income">Annual Income (₹)</label>
          <input
            id="income"
            type="number"
            placeholder="Enter annual income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            onKeyPress={handleKeyPress}
            min="0"
          />
          <button onClick={calculateLimit} disabled={loading}>
            {loading ? "Calculating..." : "Calculate Limit"}
          </button>
        </div>

        {error && <div className="error">Error: {error}</div>}

        {result && (
          <div className="result">
            <div className="result-card">
              <h3>Calculation Result</h3>
              <div className="result-item">
                <span className="label">Annual Income:</span>
                <span className="value">
                  ₹{result.annualIncome.toLocaleString()}
                </span>
              </div>
              <div className="result-item">
                <span className="label">Suggested Credit Limit:</span>
                <span className="value highlight">
                  ₹{result.suggestedLimit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="limit-brackets">
              <h4>Credit Limit Brackets:</h4>
              <ul>
                <li>≤ ₹2,00,000 → ₹50,000</li>
                <li>≤ ₹3,00,000 → ₹75,000</li>
                <li>≤ ₹5,00,000 → ₹1,00,000</li>
                <li>&gt; ₹5,00,000 → ₹2,00,000</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
