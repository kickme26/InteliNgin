import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Row, Col, Avatar, Steps, Typography, Spin } from 'antd';
import userData from '../../data/registeredusers.json'; // Ensure the correct path
import "./UserHomePage.css"; // Import the necessary CSS for styling

const { Title } = Typography;
const { Step } = Steps;

const UserHomePage = () => {
  const { name } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const profilavatar = "https://via.placeholder.com/150"; // Placeholder avatar image

  // Sample interview data
  const interviewData = [
    {
      "current_interview_level": "L1",
      "start_date": "2024-09-03T11:00:00",
      "end_date": "2024-09-13T19:00:00",
      "interviewer_name": "Aptitude",
      "registered_date": "2024-09-02T12:45:00",
      "batch_code": "BATCH004",
      "is_selected": false,
      "total_level": "L3",
      "scheduled_date": "2024-09-21T12:30:00"
    },
    {
      "current_interview_level": "L2",
      "start_date": "2024-09-04T11:00:00",
      "end_date": "2024-09-30T19:00:00",
      "interviewer_name": "Aptitude",
      "registered_date": "2024-09-02T12:45:00",
      "batch_code": "BATCH004",
      "is_selected": false,
      "total_level": "L3",
      "scheduled_date": "2024-09-27T12:30:00"
    }
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!name) {
        console.error("User ID is undefined");
        return;
      }

      const user = userData.find((user) => user.user_id === name);
      if (user) {
        setUserDetails(user);
      } else {
        console.error("User not found");
      }
    };

    fetchUserDetails();
  }, [name]);

  if (!userDetails) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
        <p>Loading...</p>
      </div>
    );
  }

  // Function to handle Start Test button click
  const handleStartTest = (scheduledDate) => {
    // Navigate to the test page
    navigate('/test');
  };

  return (
    <Card
      className="custom-card user-details-card" 
      style={{ margin: '20px', padding: '20px' }}
      title="User Details"
    >
      <Row gutter={[16, 16]} style={{ height: '100%', overflow: 'hidden' }}>
        {/* Profile Card with Avatar (Left Top) */}
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Row justify="space-between" align="middle" gutter={[24, 0]}>
              <Col span={24} className="col-info">
                <Avatar size={74} shape="square" src={profilavatar} />
                <div className="avatar-info" style={{ marginLeft: '10px' }}>
                  <h4 className="font-semibold m-0">{userDetails.name}</h4>
                  <p>{userDetails.user_id}</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Timeline Component (Right) */}
        <Col xs={24} sm={16}>
          <Card title="Interview Process" bordered={false} style={{ marginBottom: '16px', fontSize: '14px', height: '100%' }}>
            <Steps current={parseInt(userDetails.current_interview_level.slice(-1), 10) - 1} direction="horizontal">
              <Step title="L1" description="Aptitude" />
              <Step title="L2" description="Technical 1" />
              <Step title="L3" description="Technical 2" />
              <Step title="L4" description="Final Round" />
            </Steps>
          </Card>
        </Col>

        {/* Profile Info (Below Profile Card) */}
        <Col xs={24} sm={8}>
  <Card title="Personal Information" bordered={false} style={{ fontSize: '14px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div>
        <strong>Name:</strong> {userDetails.name}
      </div>
      <div>
        <strong>Phone Number:</strong> {userDetails.phone_number}
      </div>
      <div>
        <strong>Email Address:</strong> {userDetails.email}
      </div>
      <div>
        <strong>Address:</strong> {userDetails.address}
      </div>
      <div>
        <strong>Date of Birth:</strong> {userDetails.date_of_birth}
      </div>
      <div>
        <strong>Degree Completed Year:</strong> {userDetails.degree_completed_year}
      </div>
    </div>
  </Card>
</Col>


        {/* Interview Details Card with Start Test Button */}
        <Col xs={24} sm={16}>
          <Card title="Interview Levels" bordered={false} style={{ fontSize: '14px' }}>
            <Row gutter={[24, 24]}>
              {interviewData.map((interview, index) => {
                const scheduledDate = new Date(interview.scheduled_date);
                const currentDate = new Date();
                
                // Log the dates for debugging
                console.log(`Scheduled Date: ${scheduledDate}, Current Date: ${currentDate}`);
                
                // Calculate if the button should be disabled
                const isButtonDisabled = scheduledDate > currentDate;

                // Log the button state
                console.log(`Interview Level: ${interview.current_interview_level}, Button Disabled: ${isButtonDisabled}`);

                return (
                  <Col span={24} md={12} xl={8} key={index}>
                    <Card bordered={false} className="card-project">
                      <div className="card-tag">{interview.current_interview_level}</div>
                      <p>Scheduled Date: {interview.scheduled_date}</p>
                      <Row gutter={[6, 0]} className="card-footer">
                        <Col span={12}>
                          <Button
                            type="button"
                            onClick={() => handleStartTest(interview.scheduled_date)}
                            disabled={isButtonDisabled}
                            className={isButtonDisabled ? "disabled-button" : ""}
                          >
                            Start Test
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default UserHomePage;
