// src/components/ProfileAvatar/ProfileAvatar.js
import React from 'react';
import { Avatar, Space, Typography, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ProfileAvatar.css'; // Import styles if needed

const { Text } = Typography;

const ProfileAvatar = ({ name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('username'); // Clear the session storage
    navigate('/login'); // Redirect to login page
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <Space size={16} align="center" className="profile-avatar-container">
        <Avatar icon={<UserOutlined />} className="profile-avatar" />
        <Text className="profile-name">{name}</Text>
      </Space>
    </Dropdown>
  );
};

export default ProfileAvatar;
