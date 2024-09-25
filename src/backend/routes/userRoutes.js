const express = require('express');
const userController = require('../controllers/userController');
const { fetchUserByName } = require('../controllers/userController');
const router = express.Router();

router.get('/details/:name', userController.fetchUserByName);
router.post('/update/:name', userController.updateUserDetails); // Adjusted to include name as a parameter
router.get('/user/:userId', fetchUserByName);
module.exports = router;