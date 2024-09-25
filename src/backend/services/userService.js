const fs = require('fs');
const path = require('path');
const users = require('../../data/registeredusers.json');

// Fetch user details by name
const getUserByName = (name) => {
  const user = users.find((user) => user.name.trim().toLowerCase() === name.toLowerCase());
  return user || null; // Return null if user not found
};

// Save updated user details
const saveUserDetails = (updatedUser) => {
  const index = users.findIndex((user) => user.user_id === updatedUser.user_id);

  if (index !== -1) {
    users[index] = updatedUser;

    // Write updated data to JSON file
    fs.writeFileSync(path.join(__dirname, '../../data/registeredusers.json'), JSON.stringify(users, null, 2));

    return users[index]; // Return updated user details
  } else {
    throw new Error('User not found');
  }
};

module.exports = { getUserByName, saveUserDetails };
