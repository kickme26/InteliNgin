import React from 'react';
import { Calendar, Badge } from 'antd';

const AdminPageCalendar = ({ users, onDateChange }) => {
  const getListData = (value) => {
    const selectedDate = value.format('YYYY-MM-DD');

    // Initialize counters
    let scheduledCount = 0;
    let l1Count = 0;
    let l2Count = 0;

    // Count users based on scheduled_time and interview_level_name
    users.forEach(user => {
      const scheduledDate = user.scheduled_time ? user.scheduled_time.split(' ')[0] : null;
      if (scheduledDate === selectedDate) {
        scheduledCount++;
        if (user.interview_level_name === 'L1') {
          l1Count++;
        } else if (user.interview_level_name === 'L2') {
          l2Count++;
        }
      }
    });

    // Create a list to return, only including counts that are greater than zero
    const listData = [];
    if (scheduledCount > 0) {
      listData.push({ type: 'success', content: `Scheduled: ${scheduledCount}` });
    }
    if (l1Count > 0) {
      listData.push({ type: 'warning', content: `L1 Count: ${l1Count}` });
    }
    if (l2Count > 0) {
      listData.push({ type: 'error', content: `L2 Count: ${l2Count}` });
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
    onDateChange(date);
  };

  // Custom header to remove MonthYear display
  const monthCellRender = () => null; // Hide month header

  return (
    <Calendar 
      dateCellRender={dateCellRender} 
      onSelect={onSelect} 
      monthCellRender={monthCellRender} // Use custom month cell render
    />
  );
};

export default AdminPageCalendar;
