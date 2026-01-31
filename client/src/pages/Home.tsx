import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="glass-card">
        <h1 className="title">Credit Card Application System</h1>
        <p className="subtitle">
          Apply, review, and manage credit card applications securely
        </p>

        <div className="button-group">
          <button
            className="primary-btn"
            onClick={() => navigate('/applicant')}
          >
            Applicant
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate('/approver')}
          >
            Approver
          </button>
        </div>
      </div>
    </div>
  );
}