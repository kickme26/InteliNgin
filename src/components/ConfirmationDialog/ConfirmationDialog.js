import React from 'react';
import { Modal } from 'antd';
import './ConfirmationDialog.css'; // Import custom styles

const ConfirmationDialog = ({ visible, onConfirm, onCancel }) => {
  const handleOk = () => {
    onConfirm(); // Call the function to handle saving data
  };

  return (
    <Modal
      title="Confirm Finish"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="OK"
      cancelText="Cancel"
    >
      <p>Are you sure you want to finish? This action cannot be undone.</p>
    </Modal>
  );
};

export default ConfirmationDialog;
