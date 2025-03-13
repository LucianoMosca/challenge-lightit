import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FormPatients.css';

interface FormErrors {
  fullName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  documentPhoto?: string;
}

interface FormPatientProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const FormPatients: React.FC<FormPatientProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
  });
  const [documentPhoto, setDocumentPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setDocumentPhoto(acceptedFiles[0]);
        setErrors({ ...errors, documentPhoto: undefined });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /@gmail\.com$/;

    //full name (only abc and spaces)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = 'Full name should only contain letters';
    }

    //email (only gmail)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Only @gmail.com addresses are allowed';
    }

    //country code
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = 'Country code is required';
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    // Validate document photo
    if (!documentPhoto) {
      newErrors.documentPhoto = 'Document photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('countryCode', formData.countryCode);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      if (documentPhoto) {
        formDataToSend.append('documentPhoto', documentPhoto);
      }

      await axios.post('http://localhost:8000/api/patients', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        onError('An error occurred while registering the patient.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="patient-form" onSubmit={handleSubmit}>
      <h2>Add New Patient</h2>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={errors.fullName ? 'error' : ''}
        />
        {errors.fullName && (
          <div className="error-message">{errors.fullName}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group phone-group">
        <label>Phone Number</label>
        <div className="phone-inputs">
          <div className="country-code">
            <input
              type="text"
              id="countryCode"
              name="countryCode"
              placeholder="+1"
              value={formData.countryCode}
              onChange={handleChange}
              className={errors.countryCode ? 'error' : ''}
            />
            {errors.countryCode && (
              <div className="error-message">{errors.countryCode}</div>
            )}
          </div>
          <div className="phone-number">
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && (
              <div className="error-message">{errors.phoneNumber}</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Document Photo</label>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${
            errors.documentPhoto ? 'error' : ''
          }`}
        >
          <input {...getInputProps()} />
          {documentPhoto ? (
            <div className="preview">
              <img
                src={URL.createObjectURL(documentPhoto)}
                alt="Document preview"
              />
              <p>{documentPhoto.name}</p>
            </div>
          ) : (
            <p>
              {isDragActive
                ? 'Drop the file here...'
                : 'Drag & drop a JPG file here, or click to select one'}
            </p>
          )}
        </div>
        {errors.documentPhoto && (
          <div className="error-message">{errors.documentPhoto}</div>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Register Patient'}
      </button>
    </form>
  );
};

export default FormPatients;