// D:\Workspace\Inception\cbotapp\src\backend\routes\loginRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../services/loginService');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);
    if (user) {
      res.status(200).json(user); // Sends user data with role and userId
    } else {
      res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized access
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
