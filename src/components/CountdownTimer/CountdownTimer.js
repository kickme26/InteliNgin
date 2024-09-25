import React, { useState, useEffect } from 'react';
import { Typography } from 'antd'; // Import Typography from Ant Design
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './CountdownTimer.css'; // Import CSS for the countdown timer

const { Text } = Typography; // Use Text for labels and timer display

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(300); // Set initial countdown time to 5 minutes (300 seconds)
  const navigate = useNavigate(); // Initialize useNavigate for programmatic navigation

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          navigate('/result'); // Redirect to /result page when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Correctly divide by 60 to get minutes
    const secs = seconds % 60; // Get the remaining seconds
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="countdown-timer-box">
      <Text className="countdown-label">Time left:</Text>
      <Text className="countdown-time">{formatTime(timeLeft)}</Text>
    </div>
  );
};

export default CountdownTimer;
