import React from 'react';
import { User, Mail, Phone, AlertCircle } from 'lucide-react';

function CollectInfoStage({ candidateInfo, onChange, onStart, error }) {
  const missingFields = [];
  if (!candidateInfo.name) missingFields.push('name');
  if (!candidateInfo.email) missingFields.push('email');
  if (!candidateInfo.phone) missingFields.push('phone');

  return (
    <div className="collect-info-container">
      <div className="collect-info-box">
        <h2 className="collect-info-title">Complete Your Profile</h2>
        {missingFields.length > 0 && (
          <p className="collect-info-desc">
            We need some additional information before starting the interview
          </p>
        )}

        <div className="form-group">
          <label className="label">
            <User size={18} />
            Full Name
          </label>
          <input
            type="text"
            value={candidateInfo.name}
            onChange={(e) => onChange({ ...candidateInfo, name: e.target.value })}
            className="input"
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label className="label">
            <Mail size={18} />
            Email Address
          </label>
          <input
            type="email"
            value={candidateInfo.email}
            onChange={(e) => onChange({ ...candidateInfo, email: e.target.value })}
            className="input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="label">
            <Phone size={18} />
            Phone Number
          </label>
          <input
            type="tel"
            value={candidateInfo.phone}
            onChange={(e) => onChange({ ...candidateInfo, phone: e.target.value })}
            className="input"
            placeholder="Enter your phone number"
          />
        </div>

        {error && (
          <div className="error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button className="start-button" onClick={onStart}>
          Start Interview
        </button>
      </div>
    </div>
  );
}

export default CollectInfoStage;