import React, { useState } from 'react';
import './CardPatients.css';

interface Patient {
  id: number;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  documentPhoto: string;
}

interface CardPatientProps {
  patient: Patient;
}

const CardPatient: React.FC<CardPatientProps> = ({ patient }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div
      className={`patient-card ${expanded ? 'expanded' : ''}`}
      style={{ height: expanded ? 'auto' : '150px' }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="patient-card-header">
        <h3>{patient.fullName}</h3>
      </div>
      <div className="patient-document">
        <img
          src={`http://localhost:8000/uploads/${patient.documentPhoto}`}
          alt="Document"
        />
      </div>
      {expanded && (
        <div className="patient-details">
          <div className="patient-info">
            <p><strong>Email:</strong> {patient.email}</p>
            <p>
              <strong>Phone:</strong> {patient.countryCode} {patient.phoneNumber}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPatient;