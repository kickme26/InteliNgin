import React from 'react';
import { Button } from 'antd';
import './MCQContainer.css'; // Import styles

const NavigationButtons = ({ onPrevious, onNext, isFirstQuestion, isLastQuestion }) => (
  <div className="navigation-buttons">
    <Button 
      type="default" 
      onClick={onPrevious} 
      disabled={isFirstQuestion}
    >
      Previous
    </Button>
    <Button 
      type="primary" 
      onClick={onNext} 
      disabled={isLastQuestion}
    >
      Next
    </Button>
  </div>
);

export default NavigationButtons;
