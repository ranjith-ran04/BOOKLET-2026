import React from 'react';
import './Styles/Freezealert.css';

const FreezeAlert = ({ message, onConfirm, onCancel }) => {
  // console.log("In Confirm");

  return (

    <div className="freeze-alert-overlay">
      <div className="freeze-alert-box">

        <p>{message}</p>
        <div className="freeze-alert-buttons">
          <button className="freeze-alert-confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="freeze-alert-cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreezeAlert;
