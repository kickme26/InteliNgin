import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';
import AnswerCard from './AnswerCard';
import NavigationButtons from './NavigationButtons';
import './MCQContainer.css';

const MCQContainer = ({ currentIndex, setCurrentIndex, questions = [] }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(
    JSON.parse(sessionStorage.getItem('answers')) || []
  );

  useEffect(() => {
    sessionStorage.setItem('answers', JSON.stringify(selectedAnswer));
  }, [selectedAnswer]);

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
    const newAnswers = [...selectedAnswer];
    newAnswers[currentIndex] = parseInt(e.target.value, 10); // Ensure value is an integer
    setSelectedAnswer(newAnswers);
  };

  const currentQuestion = questions[currentIndex] || { answers: [] };
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="mcq-container">
      <div className="card-container">
        <QuestionCard 
           title={`Question ${currentIndex + 1}: ${currentQuestion.title}`} 
          body={currentQuestion.body} 
        />
        <AnswerCard 
          answers={currentQuestion.answers} 
          selectedAnswer={selectedAnswer[currentIndex]} 
          onChange={handleAnswerChange} 
        />
      </div>
      <NavigationButtons 
        onPrevious={handlePrevious} 
        onNext={handleNext} 
        isFirstQuestion={isFirstQuestion} 
        isLastQuestion={isLastQuestion} 
      />
    </div>
  );
};

export default MCQContainer;
