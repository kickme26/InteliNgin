// D:\Workspace\Inception\cbotapp\src\backend\controllers\chatController.js
const { getChatResponse: getChatResponseFromService } = require('../services/groqService');

async function handleChatResponse(req, res) {


  
  const { input } = req.body;
  console.log('Received user input in controller:', input);

  if (!input) {
    return res.status(400).json({ response: 'Invalid input' });
  }

  try {
    const response = await getChatResponseFromService(input);
    console.log('Response from service:', response);
    res.json({ response });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ response: 'Sorry, there was an error processing your request.' });
  }
}

module.exports = { handleChatResponse };
