// D:\Workspace\Inception\cbotapp\src\backend\routes\callbackRoutes.js

const express = require('express');
const router = express.Router();
const callbackController = require('../controllers/callbackController'); // Ensure this is correct

// Define your routes here
router.post('/your-route', callbackController.yourFunction); // Make sure yourFunction is defined

module.exports = router;
