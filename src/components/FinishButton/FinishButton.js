// src/components/FinishButton/FinishButton.js
import React, { useState } from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog'; // Import ConfirmationDialog
import './FinishButton.css';

const FinishButton = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleConfirm = () => {
    setShowDialog(false); // Hide the dialog after confirmation
    navigate('/result'); // Navigate to ResultPage after confirmation
  };

  const handleOpenDialog = () => {
    setShowDialog(true); // Show the dialog when button is clicked
  };

  const handleCancel = () => {
    setShowDialog(false); // Hide the dialog on cancel
  };

  return (
    <ConfigProvider
      button={{
        className: 'linearGradientButton',
      }}
    >
      <Button
        type="primary"
        size="large"
        icon={<AntDesignOutlined />}
        onClick={handleOpenDialog} // Show dialog on click
      >
        Finish
      </Button>
      <ConfirmationDialog
        visible={showDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfigProvider>
  );
};

export default FinishButton;
