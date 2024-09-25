
const adminService = require('../services/adminService');
// Controller function to get user details by name
const fetchUserByName = async (req, res) => {
    const { name } = req.params;
    try {
        const user = await adminService.getUserByName(name); // Make sure this method exists
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error fetching user');
    }
};
  const updateUserDetails = (req, res) => {
    const { name } = req.params;
    const updatedData = req.body; // Assuming you're sending the updated user data in the request body
  
    // Logic to find the user and update their details in your data source
    const users = adminService.fetchAdminData(); // Fetch all users
    const userIndex = users.findIndex(u => u.name === name);
  
    if (userIndex !== -1) {
      // Update user details
      users[userIndex] = { ...users[userIndex], ...updatedData };
      // Save the updated users back to your data source if needed
  
      res.status(200).json({ message: 'User details updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };
  
  module.exports = { fetchUserByName, updateUserDetails };
  