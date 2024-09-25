// D:\Workspace\Inception\cbotapp\src\backend\services\aptitudeService.js

const groq = require('../utils/groqClient');
const parseResponseContent = (responseContent) => {
    console.log('Starting to parse response content:', responseContent);

    const questions = [];
    const questionRegex = /\*\*Question \d+: ([^\*]+)\*\*\s*([\s\S]*?)(?=\*\*Question \d+:|$)/g;
    const optionRegex = /([A-D])\) ([^\n]+)/g;

    let questionMatch;

    while ((questionMatch = questionRegex.exec(responseContent)) !== null) {
        const title = questionMatch[1];
        const bodyAndOptions = questionMatch[2].trim();
        console.log('Parsed title:', title);
        console.log('Parsed body and options:', bodyAndOptions);

        // Separate body and options
        const optionsMatch = bodyAndOptions.match(optionRegex);
        let body;
        let answers = [];

        if (optionsMatch) {
            // Get the body by removing options from bodyAndOptions
            body = bodyAndOptions.replace(optionRegex, '').trim();
            // Extract answers from optionsMatch
            answers = optionsMatch.map(option => option.replace(/^[A-D]\) /, ''));
        } else {
            // If no options found, consider the whole text as body
            body = bodyAndOptions;
        }

        const question = {
            title: title.trim(),
            body: body,
            answers: answers
        };

        console.log('Parsed question:', question);
        questions.push(question);
    }

    console.log('Completed parsing. Final questions array:', questions);
    return questions;
};

  
  const getAptitudeQuestions = async (difficulty) => {
    try {
      const prompt = `Generate 5 ${difficulty} level aptitude questions. Provide options for each question.`;
      
      const messages = [
        { role: 'system', content: `You are a smart quiz generator. Respond with ${difficulty} level aptitude questions in MCQ format.` },
        { role: 'user', content: prompt }
      ];
  
      console.log('Sending request to GROQ with messages:', messages);
  
      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama3-8b-8192',
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });
  
      console.log('Received response from GROQ:', chatCompletion);
  
      const responseContent = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate questions.";
      console.log('Raw response content:', responseContent);
  
      const parsedQuestions = parseResponseContent(responseContent.trim());
      console.log('Parsed questions:', parsedQuestions);
  
      return parsedQuestions;
    } catch (error) {
      console.error('Error fetching aptitude questions from GROQ:', error);
      throw error;
    }
  };
  

module.exports = {
  getAptitudeQuestions
};
