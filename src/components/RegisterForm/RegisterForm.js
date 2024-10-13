import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Radio, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UserAddOutlined } from '@ant-design/icons';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Get jobId from URL
  const [form] = Form.useForm();
  const [jobRole, setJobRole] = useState(''); // State to hold the job role

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await fetch("http://superkingsoft.com/demo/crud_api/admin.php?action=listAllJD");
        const data = await response.json();
        
        console.log(data); // Check what the API is returning
    
        // Convert jobId to a number for comparison
        const job = data.jdList.find(job => job.id === Number(jobId));
        if (job) {
          setJobRole(job.role); // Set job role in state
          form.setFieldsValue({ apply_for_role: job.role }); // Populate form field
        } else {
          message.error('Job not found.');
        }
      } catch (error) {
        console.error('Error fetching job roles:', error);
        message.error('Failed to fetch job roles. Please try again.');
      }
    };

    fetchJobRoles();
  }, [jobId, form]);

  const onFinish = async (values) => {
    console.log('Form values:', values);

    // Construct the request body according to the API specification
    const requestBody = {
      name: values.name,
      mobile_number: values.mobile_number,
      email: values.email,
      address: values.address,
      date_of_birth: values.date_of_birth ? values.date_of_birth.format("YYYY-MM-DD") : null,
      degree_completion_year: values.degree_completion_year,
      source_of_interview: values.source_of_interview,
      experience_type: values.experience_type,
      apply_for_role: jobRole, // Use the jobRole from state
      years_of_experience: values.years_of_experience,
      ug_degree_name: values.ug_degree_name,
      ug_completed_year: values.ug_completed_year,
      ug_mark_percent: values.ug_mark_percent,
      twelvth_completed_year: values.twelvth_completed_year,
      twelvth_mark_percent: values.twelvth_mark_percent,
      tenth_completed_year: values.tenth_completed_year,
      tenth_mark_percent: values.tenth_mark_percent,
      passport_number: values.passport_number,
      aadhar_number: values.aadhar_number,
    };

    try {
      const response = await fetch("http://superkingsoft.com/demo/crud_api/user.php?action=registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.message === "success") {
        message.success('Registration successful!');
        navigate('/registersuccess', { state: { username: data.name, password: data.password } });
      } else {
        message.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('An error occurred during registration. Please try again.');
    }
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
        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Mobile Number" name="mobile_number" rules={[{ required: true, message: 'Please input your mobile number!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Date of Birth" name="date_of_birth" rules={[{ required: true, message: 'Please select your date of birth!' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Degree Completion Year" name="degree_completion_year">
            <Input />
          </Form.Item>

          <Form.Item label="Source of Interview" name="source_of_interview">
            <Select placeholder="Select source">
              <Select.Option value="reference">Reference</Select.Option>
              <Select.Option value="social-media">Social Media</Select.Option>
              <Select.Option value="walk-in">Walk In</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Experience Type" name="experience_type">
            <Radio.Group>
              <Radio value="fresher">Fresher</Radio>
              <Radio value="experience">Experience</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item 
  label="Apply for Role" 
  name="apply_for_role" 
  rules={[{ required: true, message: 'Please input the role' }]}
>
  <Input 
    value={jobRole} 
    onChange={e => setJobRole(e.target.value)} // Update jobRole state
    disabled={!jobRole} // Make it editable only when jobRole is empty
  />
</Form.Item>

          <Form.Item label="Years of Experience" name="years_of_experience">
            <Input />
          </Form.Item>

          <Form.Item label="UG Degree Name" name="ug_degree_name">
            <Input />
          </Form.Item>

          <Form.Item label="UG Completed Year" name="ug_completed_year">
            <Input />
          </Form.Item>

          <Form.Item label="UG Mark Percent" name="ug_mark_percent">
            <Input />
          </Form.Item>

          <Form.Item label="Twelvth Completed Year" name="twelvth_completed_year">
            <Input />
          </Form.Item>

          <Form.Item label="Twelvth Mark Percent" name="twelvth_mark_percent">
            <Input />
          </Form.Item>

          <Form.Item label="Tenth Completed Year" name="tenth_completed_year">
            <Input />
          </Form.Item>

          <Form.Item label="Tenth Mark Percent" name="tenth_mark_percent">
            <Input />
          </Form.Item>

          <Form.Item label="Passport Number" name="passport_number">
            <Input />
          </Form.Item>

          <Form.Item label="Aadhar Number" name="aadhar_number">
            <Input />
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
