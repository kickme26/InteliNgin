const fs = require('fs');
const path = require('path');
const users = require('../../data/registeredusers.json'); // Adjust path as needed

const getUserByName = (userId) => {
  return users.find(user => user.user_id === userId);
};

// Path to your registeredusers.json file
const filePath = path.join(__dirname, '../../backend/tabledata.json');
console.log('Fetching admin data from:', filePath); // Debug: Log the file path

// Fetch admin data from registeredusers.json
const fetchAdminData = () => {
  try {
    console.log('Attempting to read data from the file...'); // Debug: Before reading the file
    const data = fs.readFileSync(filePath, 'utf-8');
    //console.log('Data read from file:', data); // Debug: Log raw data
    return JSON.parse(data); // Parse JSON data from the file
  } catch (error) {
    console.error('Error reading data from registeredusers.json:', error);
    return []; // Return empty array in case of an error
  }
};

module.exports = { getUserByName,fetchAdminData };
