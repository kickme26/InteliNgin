import React from 'react';
import { Radio } from 'antd';
import './MCQContainer.css'; // Import styles

const AnswerCard = ({ answers = [], selectedAnswer, onChange }) => (
  <div className="answer-card">
    {answers.map((answer, index) => (
      <Radio
        key={index}
        value={index}
        checked={selectedAnswer === index}
        onChange={onChange}
      >
        {answer}
      </Radio>
    ))}
  </div>
);

export default AnswerCard;
