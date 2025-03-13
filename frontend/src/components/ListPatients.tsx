import React, { useState, useEffect } from 'react';
import PatientForm from './FormPatients';
import CardPatient from './CardPatients';
import Modal from './Modal';
import axios from 'axios';
import './ListPatients.css';

interface Patient {
  id: number;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  documentPhoto: string;
}

const ListPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/patients');
      setPatients(response.data.patients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleFormSuccess = () => {
    fetchPatients();
    setShowForm(false);
    setModalState({
      show: true,
      type: 'success',
      message: 'Patient registered successfully!',
    });
  };

  const handleFormError = (message: string) => {
    setModalState({
      show: true,
      type: 'error',
      message,
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, show: false });
  };

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h2>Patients</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add Patient
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading patients...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="empty-state">
          <p>No patients registered yet.</p>
          <button className="add-button" onClick={() => setShowForm(true)}>
            Add Your First Patient
          </button>
        </div>
      ) : (
        <div className="patient-cards">
          {patients.map((patient) => (
            <CardPatient key={patient.id} patient={patient} />
          ))}
        </div>
      )}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <button className="close-button" onClick={() => setShowForm(false)}>
              ×
            </button>
            <PatientForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />
          </div>
        </div>
      )}

      <Modal
        show={modalState.show}
        type={modalState.type}
        message={modalState.message}
        onClose={closeModal}
      />
    </div>
  );
};

export default ListPatients;