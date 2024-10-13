import React, { useState } from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FinishButton.css';

const FinishButton = ({ interviewDetails }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setShowDialog(false);
    try {
      if (interviewDetails) {
        const response = await axios.post('http://superkingsoft.com/demo/crud_api/user.php?action=updateTestStatus', interviewDetails);
        console.log("API response: ", response.data);
    
        if (response.data.message === "success") {
          navigate('/result'); // Navigate to result page after successful update
        } else {
          Modal.error({
            title: 'Error',
            content: response.data.message || 'Failed to update test status',
          });
        }
      }
    } catch (error) {
      console.error('Error updating test status:', error);
      Modal.error({
        title: 'Error',
        content: error.response ? error.response.data.message : 'Failed to update test status',
      });
    }
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <ConfigProvider
      button={{
        className: 'linearGradientButton',
      }}>
      <Button
        type="primary"
        size="large"
        icon={<AntDesignOutlined />}
        onClick={handleOpenDialog}>
        Finish
      </Button>
      <Modal
        title="Confirmation"
        visible={showDialog}
        onOk={handleConfirm}
        onCancel={handleCancel}>
        <p>Are you sure you want to finish?</p>
      </Modal>
    </ConfigProvider>
  );
};

export default FinishButton;
