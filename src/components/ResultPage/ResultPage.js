import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import './ResultPage.css';

const ResultPage = () => {
  const questions = require('../../data/questions.json');
  const answers = JSON.parse(sessionStorage.getItem('answers')) || [];

  // Count how many questions are answered
  const answeredCount = answers.filter(answer => answer !== undefined && answer !== null).length;

  return (
    <div className="result-page">
      <Result
        icon={<SmileOutlined />}
        title="Thank you for submitting the answers!"
        subTitle={`You answered ${answeredCount} questions out of ${questions.length}`}
        extra={<Button type="primary">Next</Button>}
      />
    </div>
  );
};

export default ResultPage;
