// D:\Workspace\Inception\cbotapp\src\components\RegisterForm\RegisterSuccessful.js

import React from 'react';
import { Button, Result, Space, Input, QRCode } from 'antd';
import { useLocation } from 'react-router-dom';

const RegisterSuccessful = () => {
  const location = useLocation();
  const { username, password } = location.state || { username: '', password: '' };

  return (
    <div style={{ textAlign: 'center' }}>
      <Result
        status="success"
        title="Registration Successful!"
        subTitle="Scan the QR code below to reveal your login credentials."
      />
      <Space direction="vertical" align="center">
        <QRCode value={`Username: ${username}, Password: ${password}`} />
        <Input placeholder="Scan the QR code above" maxLength={60} value={`Username: ${username}, Password: ${password}`} readOnly />
      </Space>
      <Button type="primary" onClick={() => window.location.href = '/login'}>
        Go to Login
      </Button>
    </div>
  );
};

export default RegisterSuccessful;
