import React, { useState, useEffect } from 'react';
import { Card, Radio, Space, Button } from 'antd';
import './MCQContainer.css';

const MCQContainer = ({ currentIndex, setCurrentIndex, questions = [], userId }) => {
    const initialSessionData = JSON.parse(sessionStorage.getItem('sessionData')) || { answers: [], questions: [] };
    const initialAnswers = initialSessionData.answers || [];

    // Initialize selectedAnswers with existing answers, or with empty array
    const [selectedAnswers, setSelectedAnswers] = useState(initialAnswers);

    useEffect(() => {
        // Update session storage whenever selectedAnswers or questions change
        const sessionData = {
            userId,
            answers: selectedAnswers,
            questions: questions.map(question => ({
                title: question.title,
                body: question.body,
                answers: question.answers,
                solution: question.solution // Store the correct answer
            })),
            questionsCount: questions.length,
        };
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    }, [selectedAnswers, questions, userId]);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleAnswerChange = (e) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentIndex] = parseInt(e.target.value, 10); // Store selected answer
        setSelectedAnswers(newAnswers);
    };

    const currentQuestion = questions[currentIndex] || {};
    const answers = currentQuestion.answers || []; // Default to an empty array if answers are undefined

    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <div className="mcq-container">
            <div className="card-container">
                <Card title={`${currentQuestion.title || "N/A"}`} bordered={false}>
                    <span style={{ fontSize: '15px' }}>{currentQuestion.body || "No question available."}</span>
                </Card>
                <Card bordered={false}>
                    <div className="answer-card">
                        {answers.length > 0 ? (
                            answers.map((answer, index) => (
                                <Radio
                                    key={index}
                                    value={index}
                                    checked={selectedAnswers[currentIndex] === index}
                                    onChange={handleAnswerChange}
                                >
                                    {answer}
                                </Radio>
                            ))
                        ) : (
                            <p>No answers available for this question.</p>
                        )}
                    </div>
                    <Space>
                        <Button type="default" onClick={handlePrevious} disabled={isFirstQuestion}>
                            Previous
                        </Button>
                        <Button type="default" onClick={handleNext} disabled={isLastQuestion}>
                            Next
                        </Button>
                    </Space>
                </Card>
            </div>
        </div>
    );
};

export default MCQContainer;
