const adminService = require('../services/adminService');

// Controller to get admin data
const getAdminData = (req, res) => {
  try {
    const data = adminService.fetchAdminData();
    res.status(200).json(data); // Send JSON data to frontend
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to fetch admin data' });
  }
};

module.exports = { getAdminData };
