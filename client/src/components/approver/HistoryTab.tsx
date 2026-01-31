import { useState } from "react";

interface HistoryRecord {
  _id: string;
  applicationNumber: string;
  fullName: string;
  panCard: string;
  status: string;
  creditScore?: number;
  creditLimit?: number;
  createdAt: string;
}

export default function HistoryTab() {
  const [pan, setPan] = useState("");
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!pan.trim()) {
      alert("Please enter a PAN number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("approverToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/approver/history/${pan}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      setHistory(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchHistory();
    }
  };

  return (
    <div className="history-tab">
      <h2>Applicant History</h2>
      <div className="search-section">
        <div className="search-input">
          <input
            type="text"
            placeholder="Enter PAN number"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
          />
          <button onClick={fetchHistory} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div className="error">Error: {error}</div>}

      {searched && (
        <div className="history-results">
          {history.length > 0 ? (
            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Application No</th>
                    <th>Full Name</th>
                    <th>Status</th>
                    <th>Credit Score</th>
                    <th>Credit Limit</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id}>
                      <td>{record.applicationNumber}</td>
                      <td>{record.fullName}</td>
                      <td>
                        <span className={`status ${record.status.toLowerCase()}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.creditScore || "N/A"}</td>
                      <td>
                        {record.creditLimit
                          ? `₹${record.creditLimit.toLocaleString()}`
                          : "N/A"}
                      </td>
                      <td>
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records">
              No application history found for PAN: {pan}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
