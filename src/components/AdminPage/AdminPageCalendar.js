import React from 'react';
import { Calendar, Badge } from 'antd';

const AdminPageCalendar = ({ users, onDateChange }) => {
  const getListData = (value) => {
    const selectedDate = value.format('YYYY-MM-DD');
    
    // Initialize counters
    let registeredCount = 0;
    let selectedCount = 0;
    let rejectedCount = 0;

    // Count users based on registered_date and is_selected
    users.forEach(user => {
      const registeredDate = user.registered_date.split('T')[0]; // Extract date part
      if (registeredDate === selectedDate) {
        registeredCount++;
        if (user.is_selected) {
          selectedCount++;
        } else {
          rejectedCount++;
        }
      }
    });

    // Create a list to return, only including counts that are greater than zero
    const listData = [];
    if (selectedCount > 0) {
      listData.push({ type: 'success', content: `Selected: ${selectedCount}` });
    }
    if (registeredCount > 0) {
      listData.push({ type: 'warning', content: `Registered: ${registeredCount}` });
    }
    if (rejectedCount > 0) {
      listData.push({ type: 'error', content: `Rejected: ${rejectedCount}` });
    }

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (date) => {
    onDateChange(date); // Call the date change function
  };

  return (
    <Calendar 
      dateCellRender={dateCellRender} 
      onSelect={onSelect} // Handle date selection
    />
  );
};

export default AdminPageCalendar;
