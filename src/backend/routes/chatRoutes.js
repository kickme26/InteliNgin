// D:\Workspace\Inception\cbotapp\src\backend\routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/get-response', chatController.handleChatResponse);

module.exports = router;
