import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Timeline, Typography, Spin } from 'antd';
import { MenuUnfoldOutlined, LoadingOutlined } from '@ant-design/icons';
import userData from '../../data/registeredusers.json'; // Ensure the correct path

const { Title, Text } = Typography;

const UserHomePage = () => {
  const { name } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

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
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <p>Loading...</p>
      </div>
    );
  }

  // Check if the scheduled date is in the past
  const scheduledDate = new Date(userDetails.scheduled_date);
  const currentDate = new Date();
  const isButtonDisabled = scheduledDate > currentDate;

  const handleStartTest = () => {
    navigate('/test');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card className="criclebox h-full" style={{ marginBottom: '20px' }}>
        <Card.Meta title="Orders History" />
        <Text className="lastweek" style={{ display: 'block', marginBottom: 24 }}>
          This Month <span style={{ color: '#1890ff' }}>20%</span>
        </Text>
        <Timeline pending="Recording..." pendingDot={<LoadingOutlined />}>
          <Timeline.Item color="green">
            <Title level={5} style={{ margin: 0 }}>$2,400 - Redesign store</Title>
            <Text>09 JUN 7:20 PM</Text>
          </Timeline.Item>
          <Timeline.Item color="green">
            <Title level={5} style={{ margin: 0 }}>New order #3654323</Title>
            <Text>08 JUN 12:20 PM</Text>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <Title level={5} style={{ margin: 0 }}>Company server payments</Title>
            <Text>04 JUN 3:10 PM</Text>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <Title level={5} style={{ margin: 0 }}>New card added for order #4826321</Title>
            <Text>02 JUN 2:45 PM</Text>
          </Timeline.Item>
          <Timeline.Item color="blue">
            <Title level={5} style={{ margin: 0 }}>Unlock folders for development</Title>
            <Text>18 MAY 1:30 PM</Text>
          </Timeline.Item>
          <Timeline.Item color="gray">
            <Title level={5} style={{ margin: 0 }}>New order #46282344</Title>
            <Text>14 MAY 3:30 PM</Text>
          </Timeline.Item>
        </Timeline>
        <Button type="primary" block icon={<MenuUnfoldOutlined />}>
          REVERSE
        </Button>
      </Card>

      <Card title={`Welcome, ${userDetails.name}`} style={{ marginBottom: '20px' }}>
        <Text>User ID: {userDetails.user_id}</Text>
        <div style={{ marginTop: '20px' }}>
          <Title level={4}>Scheduled Level: {userDetails.scheduled_level}</Title>
          <Title level={4}>Scheduled Date: {userDetails.scheduled_date}</Title>
          <Button
            type="primary"
            onClick={handleStartTest}
            disabled={isButtonDisabled}
            style={{ marginTop: '10px' }}
          >
            Start Test
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UserHomePage;
