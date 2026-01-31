import { useState, useEffect } from "react";

interface Application {
  _id: string;
  applicationNumber: string;
  fullName: string;
  phoneNumber: string;
  panCard: string;
  annualIncome: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  creditScore?: number;
  creditLimit?: number;
}

export default function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("approverToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/approver/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMessage = `HTTP Error: ${res.status}`;
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (id: string) => {
    try {
      const token = localStorage.getItem("approverToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/approver/approve/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to approve application");

      await fetchApplications();
      alert("✅ Application approved successfully");
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const rejectApplication = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("approverToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/approver/reject/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        },
      );

      if (!res.ok) throw new Error("Failed to reject application");

      await fetchApplications();
      alert("❌ Application rejected");
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="applications-tab">
      <h2>Pending Applications</h2>
      <div className="table-wrapper">
        <table className="applications-table">
          <thead>
            <tr>
              <th>App No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>PAN</th>
              <th>Annual Income</th>
              <th>Credit Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.applicationNumber}</td>
                <td>{app.fullName}</td>
                <td>{app.phoneNumber}</td>
                <td>{app.panCard}</td>
                <td>₹{app.annualIncome.toLocaleString()}</td>
                <td>{app.creditScore || 'N/A'}</td>
                <td>
                  <span className={`status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => approveApplication(app._id)}
                    disabled={app.status !== "PENDING"}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => rejectApplication(app._id)}
                    disabled={app.status !== "PENDING"}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && <p>No applications found</p>}
    </div>
  );
}
