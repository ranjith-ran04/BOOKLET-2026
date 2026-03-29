import React, { useState } from "react";
import './Styles/Alert.css'
const LogoutAlert = ({ message,path }) => {
  const [showAlert, setShowAlert] = useState(true);

  const handleOk = () => {
    setShowAlert(false); 
    window.location.href="/"
  };

  return (
    showAlert && (
      <div className="alert_container">

      <div className="alert">
        <div className="msg"> Logged out Successfully..! </div>
        <button className="ok-btn" onClick={handleOk}>
          OK
        </button>
      </div>
      </div>
    )
  );
};

export default LogoutAlert;
