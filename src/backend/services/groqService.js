const groq = require('../utils/groqClient');

const conversationHistory = [];
const previousUserInput = new Set();

const createSystemPrompt = (userData) => {
  return `
    You are ${userData.hr_name}, a technical interviewer. Your task is to conduct an interview based on the following information:

    Candidate Name: ${userData.userid}
    Interview Level: ${userData.level_number}
    Level Name: ${userData.level_name}
    Skills: ${userData.skills}
    Number of Questions: 8
    
    Start the interview by greeting the candidate with their name and introducing yourself Congratulate them for passing the previous if the current level is more than 1  
    Then, ask one technical question at a time about their skills, waiting for their response after each question. 
    If the candidate doesn’t answer, politely remind them they need to respond. If they answer incorrectly, simply say “okay” and move on to the next question.

    If the candidate asks you a question, respond with: “I think you misunderstood this round. I apologize, but I’m not allowed to answer any technical questions.”

    At the end of the conversation, wish the candidate all the best without providing any decision about the interview. Maintain a formal tone throughout the conversation.
  `;
};

const getChatResponse = async (userInput, userData) => {
  try {
    console.log('User data received:', userData);

    // If input is null, return the initial greeting message
    if (userInput === "" || userInput === null) {
      const greetingMessage = `Hi ${userData.userid}, nice to have you for an interview!`;
      console.log('Initial greeting message:', greetingMessage);
      return greetingMessage; // Return the greeting message directly
    }

    // Initialize conversation with a greeting message if it's the first input
    if (conversationHistory.length === 0) {
      const initialGreeting = `Hi ${userData.userid}, welcome to the chat! How can I assist you today?`;
      console.log('Conversation initialized with greeting:', initialGreeting);
      conversationHistory.push({ role: 'assistant', content: initialGreeting });
    }

    // Check and push user input
    if (typeof userInput !== 'string') {
      throw new Error("User input must be a string");
    }
    conversationHistory.push({ role: 'user', content: userInput });
    console.log('User input added to conversation history:', userInput);

    // Check for repeated input and question limit
    if (previousUserInput.has(userInput)) {
      console.log('Repeated input detected:', userInput);
      return "It seems you've mentioned this before. Can you provide more details?";
    } else {
      previousUserInput.add(userInput);
    }

    const questionLimit = userData.no_of_questions;
    const askedQuestions = conversationHistory.filter(msg => msg.role === 'assistant').length;

    console.log('Questions asked so far:', askedQuestions);
    if (askedQuestions >= questionLimit) {
      console.log('Question limit reached, ending conversation.');
      return "I've asked the maximum number of questions allowed. Thank you!";
    }

    const messages = [
      { role: 'system', content: createSystemPrompt(userData) },
      ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // Call the GROQ API with the messages
    console.log('Sending request to GROQ with conversation history:', messages);
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama3-8b-8192',
      temperature: 0.9,
      max_tokens: 80,
      top_p: 1,
      stream: false,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "Sorry, I didn't understand that.";
    console.log('Response from GROQ:', responseContent);

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
