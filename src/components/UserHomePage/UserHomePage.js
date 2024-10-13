import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Avatar, Steps, Spin } from 'antd';
import axios from 'axios';
import "./UserHomePage.css";

const { Step } = Steps;

const UserHomePage = () => {
    const { name } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Dynamically require all avatar images
    const requireAvatar = require.context('../../../public/image/avatar', false, /\.(png|jpe?g|svg)$/);
    const avatars = requireAvatar.keys().map(requireAvatar);

    // Function to select a random avatar
    const getRandomAvatar = () => {
        const randomIndex = Math.floor(Math.random() * avatars.length);
        return avatars[randomIndex];
    };

    const [profileAvatar, setProfileAvatar] = useState(getRandomAvatar());

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!name) {
                console.error("User ID is undefined");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post('http://superkingsoft.com/demo/crud_api/admin.php?action=userCompleteDetail', {
                    userid: name
                });

                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [name]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
                <p>Loading...</p>
            </div>
        );
    }

    if (!userDetails) {
        return <p>User details not found.</p>;
    }

    const handleStartTest = (interview) => {
        console.log("Starting test for:", interview);

        if (interview.level_name === "aptitude") {
            navigate(`/test/${name}/${interview.id}`);
        } else if (interview.level_name === "chat") {
            navigate(`/chat/${name}/${interview.id}`);
        } else if (interview.level_name === "human") {
            window.open(interview.meet_link, '_blank');
        } else {
            console.error("Unsupported interview level:", interview.level_name);
        }
    };

    console.log("userDetails: ", userDetails);
    const interviewData = userDetails.interview_table || [];
    const currentLevel = interviewData.findIndex(interview => interview.status === 'pending') + 1 || 0;

    return (
        <Card className="custom-card user-details-card" style={{ margin: '20px', padding: '20px' }} title="User Details">
            <Row gutter={[16, 16]} style={{ height: '100%', overflow: 'hidden' }}>
                <Col xs={24} sm={8}>
                    <Card hoverable>
                        <Row justify="space-between" align="middle" gutter={[24, 0]}>
                            <Col span={24} className="col-info">
                                <Avatar size={74} shape="square" src={profileAvatar} />
                                <div className="avatar-info" style={{ marginLeft: '10px' }}>
                                    <h4 className="font-semibold m-0">{userDetails.name}</h4>
                                    <p>{userDetails.id}</p>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} sm={16}>
                    <Card title="Interview Process" bordered={false} style={{ marginBottom: '16px', fontSize: '14px', height: '100%' }}>
                        <Steps current={currentLevel} direction="horizontal">
                            <Step title="Applied" description="Application submitted" status="finish" style={{ color: 'blue' }} />
                            {interviewData.filter(interview => interview.level !== 'callback').map((interview, index) => {
                                let status = "wait";
                                if (interview.status === "completed") {
                                    status = "finish";
                                } else if (interview.status === "rejected") {
                                    status = "error";
                                } else if (currentLevel === index + 1) {
                                    status = "process";
                                }

                                return (
                                    <Step
                                        key={index}
                                        title={interview.level}
                                        description={interview.level_name}
                                        status={status}
                                        style={{
                                            color: status === "finish" ? 'blue' : status === "error" ? 'red' : 'black',
                                        }}
                                    />
                                );
                            })}
                            <Step 
                                title={
                                    userDetails.status === "Rejected" 
                                        ? <span style={{ color: 'red' }}>Final Round <span role="img" aria-label="cross">❌</span></span>
                                        : userDetails.status === "Selected"
                                            ? <span style={{ color: 'green' }}>Final Round <span role="img" aria-label="check">✔️</span></span>
                                            : "Final Round"
                                } 
                                description={
                                    userDetails.status === "Selected" 
                                        ? "You are selected! Wait for the onboarding process."
                                        : userDetails.status === "Rejected" 
                                            ? "Better luck next time."
                                            : "Final interview stage"
                                } 
                                status={currentLevel >= interviewData.length + 1 ? "finish" : "wait"} 
                                style={{ color: currentLevel >= interviewData.length + 1 ? 'blue' : 'black' }} 
                            />
                        </Steps>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card title="Personal Information" bordered={false} style={{ fontSize: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div><strong>Name:</strong> {userDetails.name}</div>
                            <div><strong>Phone Number:</strong> {userDetails.mobile_number}</div>
                            <div><strong>Email Address:</strong> {userDetails.email}</div>
                            <div><strong>Address:</strong> {userDetails.address}</div>
                            <div><strong>Date of Birth:</strong> {userDetails.date_of_birth}</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={16}>
                    <Card title="Interview Levels" bordered={false} style={{ fontSize: '14px' }}>
                        {interviewData.length === 0 ? (
                            <p>No interviews are scheduled. Kindly wait for updates.</p>
                        ) : (
                            <Row gutter={[24, 24]}>
                                {interviewData.map((interview, index) => {
                                    const scheduledDate = new Date(interview.schedule_date_time);
                                    const currentDate = new Date();
                                    const isButtonDisabled = scheduledDate > currentDate;

                                    return (
                                        <Col span={24} md={16} xl={8} key={index}>
                                            <Card bordered={false} className="card-project">
                                                <div className="card-tag">{interview.level}</div>
                                                <p>Scheduled Date: {scheduledDate.toLocaleString()}</p>
                                                <Row gutter={[6, 0]} className="card-footer">
                                                    <Col span={12}>
                                                        {interview.status === "completed" ? (
                                                            <Button type="button" style={{ backgroundColor: 'green', color: 'white' }} disabled>
                                                                Completed
                                                            </Button>
                                                        ) : (
                                                            ["aptitude", "chat", "human"].includes(interview.level_name) && (
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => handleStartTest(interview)}
                                                                    disabled={isButtonDisabled}
                                                                    className={isButtonDisabled ? "disabled-button" : ""}
                                                                >
                                                                    Start Test
                                                                </Button>
                                                            )
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default UserHomePage;
