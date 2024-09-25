import React, { useState, useEffect } from 'react';
import { Button, Card, Descriptions, Form, Input, Select, message } from 'antd';
import userData from '../../data/registeredusers.json'; // Your initial data source
import { useParams } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm(); // Initialize form

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
      title="User Details"
      style={{ width: 600, margin: 'auto', marginTop: 20 }}
      extra={<Button onClick={isEditing ? handleSave : handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Phone Number" name="phone_number">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Date of Birth" name="date_of_birth">
          <Input disabled={!isEditing} placeholder="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Degree Completed Year" name="degree_completed_year">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Source of Interview" name="source_of_interview">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Experience Level" name="experience_level">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Current Interview Level" name="current_interview_level">
          <Input disabled={!isEditing} />
        </Form.Item>
        <Form.Item label="Scheduled Level" name="scheduled_level">
          <Select disabled={!isEditing} placeholder="Choose Level">
            <Option value="L1">L1</Option>
            <Option value="L2">L2</Option>
            <Option value="L3">L3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Scheduled Date" name="scheduled_date">
          <Input 
            disabled={!isEditing} 
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserDetailsPage;
