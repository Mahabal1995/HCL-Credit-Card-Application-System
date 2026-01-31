import { useState } from 'react';

export default function Applicant() {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    pan: '',
    annualIncome: ''
  });

  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitApplication = async () => {
    setError('');

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setApplicationNumber(data.applicationNumber);
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <h2>Credit Card Application</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="dob" type="date" onChange={handleChange} />
      <input name="pan" placeholder="PAN Number" onChange={handleChange} />
      <input name="annualIncome" type="number" placeholder="Annual Income" onChange={handleChange} />

      <button onClick={submitApplication}>Submit</button>

      {applicationNumber && (
        <p>✅ Application Number: <b>{applicationNumber}</b></p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}