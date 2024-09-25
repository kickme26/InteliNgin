import React from 'react';
import { Card } from 'antd';
import './MCQContainer.css'; // Import styles

const QuestionCard = ({ title, body }) => {
  return (
    <div className="question-cards">
      <Card className="title-card" style={{ margin: '16px 0' }}>
        <h2 className="question-title">{title}</h2>
      </Card>
      <Card className="body-card" style={{ margin: '16px 0' }}>
        <h4 className="question-body">{body}</h4>
      </Card>
    </div>
  );
};

export default QuestionCard;
