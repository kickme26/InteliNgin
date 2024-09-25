import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setUsername }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const { username, password } = values;

    try {
      const response = await fetch('http://localhost:5000/api/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsername(username, data.role);
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(`/userhome/${encodeURIComponent(username)}`);
        }
      } 
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <span className="r"></span>
        <span className="r s"></span>
        <span className="r s"></span>
        <span className="r"></span>
      </div>
      <div className="login-page">
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>
        <p className="mb-0 text-muted">
          Don’t have an account? <a href="/register">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
