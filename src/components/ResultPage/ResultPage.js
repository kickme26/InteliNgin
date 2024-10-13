import React from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ResultPage.css';

const ResultPage = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const { userid, username } = userData;

    // Assuming answers and questionsCount are still available in local state or props
    const answers = []; // Replace with actual data source
    const questionsCount = 0; // Replace with actual data source
    const questions = []; // Replace with actual data source

    console.log("userId Result Page", userid);

    // Ensure that the answers and questions are defined
    const answeredCount = answers ? answers.filter(answer => answer !== undefined && answer !== null).length : 0;

    // Calculate correct and incorrect answers if questions are defined
    const correctAnswers = questions ? questions.reduce((count, question, index) => {
        if (answers[index] !== undefined && answers[index] !== null) {
            const solutionIndex = 'ABCD'.indexOf(question.solution);
            return count + (answers[index] === solutionIndex ? 1 : 0);
        }
        return count;
    }, 0) : 0;

    const incorrectAnswers = answeredCount - correctAnswers;
    const unansweredCount = questionsCount - answeredCount;

    const handleNext = () => {
        localStorage.removeItem('userData'); // Clear user data
        navigate(`/userhome/${userid}`); // Navigate with userid
    };

    return (
        <div className="result-page">
            <Result
                icon={<SmileOutlined />}
                title={`Thank you, ${username || 'User'}!`}
                subTitle={`You answered ${answeredCount} questions out of ${questionsCount} total questions.`}
                extra={<Button type="primary" onClick={handleNext}>Next</Button>}
            />
            <div className="results-summary">
                <p>Total Questions: {questionsCount}</p>
                <p>Correct Answers: {correctAnswers}</p>
                <p>Incorrect Answers: {incorrectAnswers}</p>
                <p>Unanswered Questions: {unansweredCount}</p>
            </div>
        </div>
    );
};

export default ResultPage;
