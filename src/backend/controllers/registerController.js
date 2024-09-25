// D:\Workspace\Inception\cbotapp\src\backend\controllers\registerController.js

const registerService = require('../services/registerService');

// Controller function to handle registration
exports.registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await registerService.registerUser(userData);
    res.status(201).json({ message: 'Registration successful!', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration.', error: error.message });
  }
};
