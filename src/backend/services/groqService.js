const groq = require('../utils/groqClient');

const conversationHistory = [];
const previousUserInput = new Set(); // Track previous user inputs

const getChatResponse = async (userInput) => {
  try {
    // Add the user input to the conversation history
    conversationHistory.push({ role: 'user', content: userInput });

    // Detect if the user has provided the same answer multiple times
    if (previousUserInput.has(userInput)) {
      const systemMessage = {
        role: 'system',
        content: 'It seems you have mentioned this before. Can you provide more details or specify another area of interest?'
      };
      conversationHistory.unshift(systemMessage); // Add the system message to the beginning
    } else {
      previousUserInput.add(userInput);
    }

    // Prepare the messages for the GROQ API @TODO: 
    const messages = [
      {
        role: 'system',
        content: 'You are a friendly HR. Respond to the user with concise questions or comments, and ask basic Python questions as MCQs or fill-ups.'
      },
      ...conversationHistory
    ];

    console.log('Sending request to GROQ with conversation history:', messages); // Log the conversation history

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama3-8b-8192',
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    console.log('Received response from GROQ:', chatCompletion); // Log the GROQ response

    const responseContent = chatCompletion.choices[0]?.message?.content || "Sorry, I don't understand that.";
    
    // Add the AI response to the conversation history
    conversationHistory.push({ role: 'assistant', content: responseContent.trim() });

    return responseContent.trim();
  } catch (error) {
    console.error('Error communicating with GROQ:', error);
    throw error; // Propagate the error to be handled in the controller
  }
};

module.exports = {
  getChatResponse
};
