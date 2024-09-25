// D:\Workspace\Inception\cbotapp\src\backend\routes\registerRoutes.js

const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// Define the registration route
router.post('/register', registerController.registerUser);

module.exports = router;
