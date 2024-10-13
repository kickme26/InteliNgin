const express = require('express');
const { fetchAptitudeQuestions } = require('../controllers/aptitudeController');
const router = express.Router();

// Define route to fetch questions based on difficulty level
router.post('/questions/', fetchAptitudeQuestions);

module.exports = router;
