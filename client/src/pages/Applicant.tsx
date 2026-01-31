import { useState } from "react";
import "./Applicant.css";

export default function Applicant() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    pan: "",
    annualIncome: "",
  });

  const [applicationNumber, setApplicationNumber] = useState<string | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitApplication = async () => {
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/applications",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    
    const data = await res.json();
    setApplicationNumber(data.applicationNumber);
  };

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1>Credit Card Application</h1>
          <p>Complete the form below to apply for a new credit card</p>
        </header>

        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>PAN Number</label>
            <input name="pan" value={form.pan} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Annual Income (₹)</label>
            <input
              type="number"
              name="annualIncome"
              value={form.annualIncome}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="actions">
          <button onClick={submitApplication}>Submit Application</button>
        </div>

        {applicationNumber && (
          <div className="success">
            ✅ Application Submitted Successfully
            <span>Application No: {applicationNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
}
