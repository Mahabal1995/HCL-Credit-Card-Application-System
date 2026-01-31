import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Applicant.css'

const Applicant = () => {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    pan: "",
    annualIncome: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitApplication = async () => {
    try {
      const res = await fetch("http://localhost:3000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Application submitted successfully!");
        // Redirect after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>Credit Card Application</h1>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
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
            <label>PAN</label>
            <input name="pan" value={form.pan} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Annual Income</label>
            <input
              type="number"
              name="annualIncome"
              value={form.annualIncome}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="actions">
          <button onClick={submitApplication}>Submit</button>
        </div>

        {successMessage && (
          <div className="success">
            {successMessage}
            <span>Redirecting to home...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicant;