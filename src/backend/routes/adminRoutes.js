const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route for getting admin data
router.get('/data', adminController.getAdminData);

module.exports = router;
