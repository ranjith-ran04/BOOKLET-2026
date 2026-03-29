import React, { useState, useRef, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import axios from 'axios';
import { backend_path } from '../Constants/backend';
import './Styles/SessionTimer.css';

const SessionTimer = ({ children }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [remainingTime, setRemainingTime] = useState(120);
    const countdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            const res = await axios.post(`${backend_path}/logout`, {});
            if (res.data.success) {
                window.location.href = "/logout";
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const startCountdown = () => {

        setRemainingTime(120);
        countdownRef.current = setInterval(() => {
            setRemainingTime(prev => {
                if (prev === 1) {
                    clearInterval(countdownRef.current);
                    // alert("guru")
                    handleLogout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const { reset } = useIdleTimer({
        timeout: 3 * 60 * 1000,
        onIdle: () => {
            setShowAlert(true);
            startCountdown();
        }
    });

    const extendSession = () => {
        setShowAlert(false);
        clearInterval(countdownRef.current);
        reset();
    };

    const convertSecondsToMinSec = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} minutes ${remainingSeconds} seconds`;
    };

    return (
        <div className='session_timer'>

            {children}

            <div className='session_timer_container'>
                {showAlert && (
                    <div className="session_timer_alert">
                        <p>You have been inactive for more than 3 minutes!</p>
                        <p>Remaining time: {convertSecondsToMinSec(remainingTime)}</p>
                        <button className='extend_session' onClick={extendSession}>Extend Session</button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default SessionTimer;
