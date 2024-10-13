import React, { useEffect, useState } from 'react';
import { Layout, Button, Spin, Space, Alert, Row, Col } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import FinishButton from '../FinishButton/FinishButton';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import CountdownTimer from '../CountdownTimer/CountdownTimer';
import MCQContainer from '../MCQ/MCQContainer';
import './Layout.css';
import axios from 'axios';

const { Header, Footer, Content } = Layout;

const LayoutComponent = ({ onLogout }) => {
    const { userid, interviewId } = useParams(); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timerValue, setTimerValue] = useState(360);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [interviewDetails, setInterviewDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.post('http://superkingsoft.com/demo/crud_api/admin.php?action=userCompleteDetail', {
                    userid: userid
                });

                const userDetails = response.data;

                if (!userDetails || !userDetails.AI_Aptitude || userDetails.AI_Aptitude.length === 0) {
                    throw new Error('User details or AI Aptitude data not found.');
                }

                const testDetails = userDetails.AI_Aptitude[0]; 
                const timerFromUser = parseInt(testDetails.timer, 10); 
                const validTimerValue = isNaN(timerFromUser) || timerFromUser <= 0 ? 360 : timerFromUser * 60;

                setTimerValue(validTimerValue);
                const testdata = {
                    userid: userDetails.userid,
                    level_no: testDetails.level_number,
                    no_of_questions: testDetails.no_of_questions,
                    timer: validTimerValue,
                    scheduled_time: testDetails.scheduled_time,
                    status: testDetails.status,
                    difficulty: "medium"
                };

                const questionsResponse = await fetch(`/api/aptitude/questions/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(testdata),
                });

                if (!questionsResponse.ok) {
                    const errorData = await questionsResponse.text();
                    throw new Error(`Failed to fetch questions: ${questionsResponse.status} ${errorData}`);
                }

                const questionsData = await questionsResponse.json();
                setQuestions(Array.isArray(questionsData) ? questionsData : []);

                const interviewDetail = {
                    userid: userid,
                    status: "completed",
                    interview_detail_id: interviewId,
                    level_name: "aptitude",
                };
                setInterviewDetails(interviewDetail);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // Standard for Chrome
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userid, interviewId]);

    const handleTimeUp = () => {
        setIsTimerRunning(false);
        navigate('/result');
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" />;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return <Alert message="No questions available." type="info" />;
    }

    return (
        <Layout>
            <Header className="layout-header">
                <div className="header-item header-avatar">
                    <ProfileAvatar name={sessionStorage.getItem('username')} />
                </div>
                <div className="header-item header-label">
                    <span className="header-label-text">Intelizign Test</span>
                </div>
                <div className="header-item header-timer">
                    <CountdownTimer initialTime={timerValue} onTimeUp={handleTimeUp} isRunning={isTimerRunning} />
                </div>
            </Header>
            <Content className="layout-content">
                <Row gutter={24} style={{ height: '100%' }}>
                    <Col xs={24} xl={20}>
                        <MCQContainer
                            currentIndex={currentIndex}
                            setCurrentIndex={setCurrentIndex}
                            questions={questions}
                        />
                    </Col>
                    <Col xs={24} xl={4} style={{ color: 'black', backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: '1 1 0%', overflowY: 'hidden' }}>
                            <Space wrap>
                                {questions.map((_, index) => (
                                    <Button
                                        key={index}
                                        type={index === currentIndex ? 'primary' : 'default'}
                                        shape="circle"
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </Space>
                        </div>
                        <div style={{ height: '20%', display: 'flex', alignItems: 'flex-end' }}>
                            <FinishButton className="finish-button" interviewDetails={interviewDetails} />
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer className="layout-footer">
                <div className="footer-content">
                    <span>© 2024, made with G.O.A.T Team for a better web.</span>
                    <span className="footer-credits">Creative Tim | Developed by (Sathya, Sandhya, Guna, Monish)</span>
                </div>
            </Footer>
        </Layout>
    );
};

export default LayoutComponent;
