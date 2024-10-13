import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import './CountdownTimer.css';

const { Text } = Typography;

const CountdownTimer = ({ initialTime, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset time left when initialTime changes
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning) return; // Do not start the timer if not running

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onTimeUp(); // Call the onTimeUp function when time is up
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [isRunning, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const timerClass = timeLeft <= 120 ? 'countdown-timer-box red' : 'countdown-timer-box blue'; // Change class based on time left

  return (
    <div className={timerClass}>
      <Text className="countdown-label">Time left:</Text>
      <Text className="countdown-time">{formatTime(timeLeft)}</Text>
    </div>
  );
};

export default CountdownTimer;
