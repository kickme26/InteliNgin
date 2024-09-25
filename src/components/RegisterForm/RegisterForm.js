import React from 'react';
import { Form, Input, Button, DatePicker, Select, Radio, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserAddOutlined } from '@ant-design/icons';
import './RegisterForm.css'; 

const RegisterForm = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Registration successful!');

    const generatedPassword = 'temporaryPassword123'; 
    navigate('/registersuccess', { state: { username: values.email, password: generatedPassword } });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="r"></div>
        <div className="r"></div>
        <div className="r"></div>
        <div className="r"></div>
      </div>
      <div className="register-page">
        <h3 className="mb-4">
          <UserAddOutlined style={{ marginRight: '10px' }} /> Sign Up
        </h3>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dob"
            rules={[{ required: true, message: 'Please select your date of birth!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Degree Completed Year"
            name="degreeYear"
            rules={[{ required: true, message: 'Please input your degree completed year!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Source of Interview"
            name="source"
            rules={[{ required: true, message: 'Please select a source!' }]}
          >
            <Select placeholder="Select source">
              <Select.Option value="reference">Reference</Select.Option>
              <Select.Option value="social-media">Social Media</Select.Option>
              <Select.Option value="walk-in">Walk In</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Fresher or Experience"
            name="experience"
            rules={[{ required: true, message: 'Please select an option!' }]}
          >
            <Radio.Group>
              <Radio value="fresher">Fresher</Radio>
              <Radio value="experience">Experience</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
