const aptitudeService = require('../services/aptitudeService');

const fetchAptitudeQuestions = async (req, res) => {
  const { userid } = req.params; // Get user ID from URL
  const requestBody = req.body;  // Get request body

  console.log('Request Body:', requestBody); // Print request body

  try {
    const questions = await aptitudeService.getAptitudeQuestions(requestBody); // Assuming difficulty is sent in the body
    res.json(questions); // Respond with questions
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

module.exports = { fetchAptitudeQuestions };
