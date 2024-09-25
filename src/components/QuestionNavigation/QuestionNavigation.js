import React from 'react';
import { Button, Space } from 'antd';
import './QuestionNavigation.css'; // Import styles

const QuestionNavigation = ({ questionCount, currentIndex, onNavigate }) => {
  return (
    <div className="question-navigation">
      <Space wrap>
        {Array.from({ length: questionCount }, (_, index) => (
          <Button
            key={index}
            size="small"
            type={index === currentIndex ? 'primary' : 'default'}
            onClick={() => onNavigate(index)}
          >
            {index + 1}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default QuestionNavigation;
