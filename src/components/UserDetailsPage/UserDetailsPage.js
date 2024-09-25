import React, { useState, useEffect } from 'react';
import { Button, Card, Descriptions, Form, Input, Select, message, Row, Col, Avatar, Steps } from 'antd';
import { useParams } from 'react-router-dom';
import "./UserDetailsPage.css"
import userData from '../../data/registeredusers.json'; // Initial data source

const { Option } = Select;
const { Step } = Steps;

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const profilavatar = "https://via.placeholder.com/150"; // Placeholder avatar image

  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('registeredusers')) || userData;
    const user = storedUserDetails.find(user => user.user_id === userId);
    if (user) {
      setUserDetails(user);
      form.setFieldsValue(user); // Set form values from user details
    } else {
      console.error("User not found");
    }
  }, [userId, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        const updatedUserDetails = JSON.parse(localStorage.getItem('registeredusers')) || userData;
        const updatedUsers = updatedUserDetails.map(user => 
          user.user_id === userId ? { ...user, ...values } : user
        );

        localStorage.setItem('registeredusers', JSON.stringify(updatedUsers));
        message.success('User details saved successfully!');
        setIsEditing(false);
        setUserDetails({ ...userDetails, ...values }); // Update local state
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  if (!userDetails) return <div>Loading...</div>;

  return (
    <Card 
      className="custom-card user-details-card" // Add user-details-card class
      style={{ margin: '20px', padding: '20px' }} // Card to hold all content with margin and padding
      title="User Details" // Optional title for the card
    >
      <Row gutter={[16, 16]} style={{ height: '100%', overflow: 'hidden' }}>
        {/* Profile Card with Avatar (Left Top) */}
        <Col xs={24} sm={8}>
          <Card
            hoverable
            className="card-profile-head"
          >
            <Row justify="space-between" align="middle" gutter={[24, 0]}>
              <Col span={24} md={12} className="col-info">
                <Avatar size={74} shape="square" src={profilavatar} />
                <div className="avatar-info" style={{ marginLeft: '10px' }}>
                </div>
              </Col>
            </Row>
            <div>
              <h4 className="font-semibold m-0">{userDetails.name}</h4>
              <p>{userDetails.user_id}</p>
            </div>
          </Card>
        </Col>

        {/* Timeline Component (Right) */}
        <Col xs={24} sm={16}>
          <Card 
            title="Interview Process" 
            bordered={false} 
            style={{ marginBottom: '16px', fontSize: '14px', height: '100%' }} // Ensure equal height
          >
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
          <Card
            className="user-info-card"
            title="Personal Information"
            bordered={false}
            style={{ fontSize: '14px' }}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name">
                <Input disabled={!isEditing} size="small" />
              </Form.Item>
              <Form.Item name="phone_number" label="Phone Number">
                <Input disabled={!isEditing} size="small" />
              </Form.Item>
              <Form.Item name="email" label="Email Address">
                <Input disabled={!isEditing} size="small" />
              </Form.Item>
              <Form.Item name="address" label="Address">
                <Input disabled={!isEditing} size="small" />
              </Form.Item>
              <Form.Item name="date_of_birth" label="Date of Birth">
                <Input disabled={!isEditing} placeholder="YYYY-MM-DD" size="small" />
              </Form.Item>
              <Form.Item name="degree_completed_year" label="Degree Completed Year">
                <Input disabled={!isEditing} size="small" />
              </Form.Item>
            </Form>
            {isEditing ? (
              <Button type="primary" size="small" onClick={handleSave}>
                Save
              </Button>
            ) : (
              <Button type="link" size="small" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </Card>
        </Col>

        {/* Interview Details (Right below Timeline) */}
        <Col xs={24} sm={16}>
          <Card title="Interview Details" bordered={false} style={{ fontSize: '14px' }}>
            <Descriptions>
              <Descriptions.Item label="Experience Level">
                {userDetails.experience_level}
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Level">
                <Select disabled={!isEditing} size="small" defaultValue={userDetails.scheduled_level}>
                  <Option value="L1">L1</Option>
                  <Option value="L2">L2</Option>
                  <Option value="L3">L3</Option>
                  <Option value="L4">L4</Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled Date">
                <Input disabled={!isEditing} size="small" placeholder="YYYY-MM-DD HH:mm:ss" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default UserDetailsPage;
