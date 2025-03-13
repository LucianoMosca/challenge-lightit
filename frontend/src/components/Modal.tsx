import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, type, message, onClose }) => {
  useEffect(() => {
    if (show && type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, type, onClose]);

  if (!show) return null;

  return (
    <div className={`modal-overlay ${show ? 'visible' : ''}`} onClick={onClose}>
      <div 
        className={`modal-content modal-${type} ${show ? 'animate-in' : ''}`} 
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="animate-fade-in">{type === 'success' ? 'Success!' : 'Error'}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className={`icon-container ${type}-animation`}>
            {type === 'success' ? (
              <svg className="icon success-icon" viewBox="0 0 24 24">
                <path
                  className="svg-path"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
            ) : (
              <svg className="icon error-icon" viewBox="0 0 24 24">
                <path
                  className="svg-path"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            )}
          </div>
          
          <p className="animate-fade-in delay-2">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="confirm-button animate-fade-in delay-3" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;