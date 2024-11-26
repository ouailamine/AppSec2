import React from 'react';
import PropTypes from 'prop-types';


const Modal = ({ isOpen, onRequestClose, event, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onRequestClose}>Close</button>
        <h2>Edit Event</h2>
       
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,

};

export default Modal;
