import React from 'react';
import { Button, Space } from 'antd';
import './MCQContainer.css'; // Import styles

const NavigationButtons = ({ onPrevious, onNext, isFirstQuestion, isLastQuestion }) => (
  <div className="navigation-buttons" style={{ padding: '20px' }}>
    <Space>
      <Button 
        className="custom-btn" // Use custom class
        onClick={onPrevious}  
        disabled={isFirstQuestion}
      >
        Previous
      </Button>
      <Button 
        className="custom-btn" // Use custom class
        onClick={onNext}  
        disabled={isLastQuestion}
      >
        Next
      </Button>
    </Space>
  </div>
);

export default NavigationButtons;
