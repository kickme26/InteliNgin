import React, { useEffect, useState } from 'react';
import { Layout, Modal, Button, Spin, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import FinishButton from '../FinishButton/FinishButton';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import MCQContainer from '../MCQ/MCQContainer';
import QuestionNavigation from '../QuestionNavigation/QuestionNavigation';
import './Layout.css';

const { Header, Footer, Sider, Content } = Layout;

const LayoutComponent = ({ onLogout }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in or not
    // const username = sessionStorage.getItem('username');
    // console.log("Checking login status:", username); // Debugging line
    // if (!username) {
    //   navigate('/login'); // Redirect to login if not logged in
    //   return; // Prevent further execution
    // }

    // Fetch questions from the backend
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/aptitude/questions/easy'); // Replace 'easy' with the desired level
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log("Fetched Questions:", data.questions); // Debugging line
        setQuestions(data.questions);
      } catch (err) {
        console.error("Fetch error:", err); // Debugging line
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    // Prevent refresh on the test page if logged in
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  const handleNavigate = (index) => {
    setCurrentIndex(index);
  };

  const handleFinishClick = () => {
    Modal.confirm({
      title: 'Are you sure you want to finish?',
      onOk: () => navigate('/result'),
    });
  };

  const handleTimeUp = () => {
    navigate('/result'); // Redirect to the result page when time is up
  };

  const handleLogout = () => {
    // Clear session storage, including username and answers
    sessionStorage.clear(); 

    // Redirect to login page
    navigate('/login');
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  if (questions.length === 0) {
    return <Alert message="No questions available." type="info" />;
  }

  return (
    <Layout className="layout">
      <Sider className="layout-sider" breakpoint="lg" collapsedWidth="0">
        <div className="question-navigation">
          <QuestionNavigation
            questionCount={questions.length} // Pass the number of questions
            currentIndex={currentIndex}
            onNavigate={handleNavigate}
          />
        </div>
        <FinishButton className="finish-button" onClick={handleFinishClick} />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div className="header-item header-timer">
            <CountdownTimer onTimeUp={handleTimeUp} />
          </div>
          <div className="header-item header-label">
            <span className="header-label-text">IntelNgin Test</span>
          </div>
          <div className="header-item header-avatar">
            <ProfileAvatar name={sessionStorage.getItem('username')} />
          </div>
          <div className="header-item header-logout">
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        </Header>
        <Content className="layout-content">
          <MCQContainer 
            currentIndex={currentIndex} 
            setCurrentIndex={setCurrentIndex} 
            questions={questions} 
          />
        </Content>
        <Footer className="layout-footer">Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
