const fs = require('fs');
const path = require('path');

// Hardcoded credentials for quick testing
const hardcodedUsers = [
  { user_id: 'admin', password: 'admin', role: 'admin' },
  { user_id: 'user', password: 'user', role: 'user' },
];

const authenticateUser = async (username, password) => {
  console.log('Authentication attempt:', { username, password });

  // Check hardcoded credentials
  const hardcodedUser = hardcodedUsers.find(
    (u) => u.user_id === username && u.password === password
  );

  if (hardcodedUser) {
    console.log('Authentication successful for hardcoded user:', username);
    return { userId: hardcodedUser.user_id, role: hardcodedUser.role }; // Return userId and role
  }

  // Load user data from JSON file
  const dataPath = path.join(__dirname, '..', 'tabledata.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log('Loaded user data:', data);

  // Match user in the JSON data
  const user = data.find(
    (u) => u.user_id === username && u.password === password
  );

  if (user) {
    console.log('Authentication successful for user:', username);
    return { userId: user.user_id, role: user.is_selected ? 'user' : 'admin' }; // Return role based on selection status
  }

  console.log('Authentication failed for username:', username);
  return null;
};

module.exports = {
  authenticateUser,
};
