// chatController.js
const { getChatResponse: getChatResponseFromService } = require('../services/groqService');

async function handleChatResponse(req, res) {
  const { input, userData } = req.body; // Destructure userData from the request
  console.log('Received user input in controller:', input);
  console.log('Received user data:', userData); // Log the user data

  if (!input) {
    return res.status(400).json({ response: 'Invalid input' });
  }

  try {
    const response = await getChatResponseFromService(input, userData); // Pass userData to the service
    console.log('Response from service:', response);
    res.json({ response });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ response: 'Sorry, there was an error processing your request.' });
  }
}

module.exports = { handleChatResponse };
