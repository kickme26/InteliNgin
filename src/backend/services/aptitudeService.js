const groq = require('../utils/groqClient');

const parseResponse = (response) => {
    console.log('Starting to parse response...');
    const questions = [];
    const questionRegex = /(\*\*Question \d+: [^\*]+\*\*)/g;
    const optionRegex = /([A-D]\))\s*([^\n]+)/g;

    // Split response into individual questions
    const fullQuestions = response.split(/(?=\*\*Question \d+:)/);
    console.log('Full questions split:', fullQuestions);

    for (const fullQuestionText of fullQuestions) {
        console.log('Processing full question text:', fullQuestionText);

        const titleMatch = fullQuestionText.match(questionRegex);
        let title = '';
        let body = '';

        if (titleMatch) {
            // Capture the title and body
            const titleParts = titleMatch[0].replace(/\*\*/g, '').trim();
            const titleEndIndex = titleParts.indexOf(':') + 1;
            title = titleParts.substring(0, titleEndIndex).trim(); // Title until the colon
            body = titleParts.substring(titleEndIndex).trim(); // Body after the colon
        }

        console.log('Extracted title:', title);
        console.log('Extracted body:', body);

        const optionsMatch = [...fullQuestionText.matchAll(optionRegex)];
        console.log('Matched options:', optionsMatch);

        const answers = optionsMatch.map(option => option[2].trim());
        console.log('Extracted answers:', answers);

        // Extract the correct answer
        const answerMatch = /Correct Answer: ([A-D])/.exec(fullQuestionText);
        const correctAnswer = answerMatch ? answerMatch[1] : null;
        console.log('Extracted correct answer:', correctAnswer);

        const question = {
            title,
            body,
            answers,
            solution: correctAnswer
        };

        if (title) { // Ensure that only valid questions are added
            questions.push(question);
            console.log('Added question:', question);
        }
    }

    console.log('Finished parsing. Total questions parsed:', questions.length);
    return questions;
};



const getAptitudeQuestions = async (requestBody) => {
    console.log("*****requestBody********", requestBody);
    try {
        const prompt = `Generate ${requestBody.no_of_questions} text-based aptitude questions suitable for freshers preparing for job interviews. Each question should adhere to the following guidelines: 
        1. The difficulty level should be set to ${requestBody.difficulty}.
        2. Each question must be concise, containing no more than 40 words.
        3. Provide four multiple-choice options (A, B, C, D) for each question.
        4. Ensure to indicate the correct answer for each question as follows: "Correct Answer: A" (where A is the correct option).
        5. Ensure the questions cover the following topics: 
            - Reasoning
            - Sums
            - Logical reasoning
            - Time-speed problems
            - Percentage calculations
            - Ratio and proportion
            - Data interpretation
            - Profit and loss
            - Simple and compound interest
            - Algebraic expressions
        6. Ensure the questions are clear, professional, and relevant to common aptitude tests.
        
Please format your response exactly as follows:
**Question 1: [Question Text]**
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]

**Question 2: [Question Text]**
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct Answer: [A/B/C/D]

... (and so on for all questions). Each question must follow this structure without any additional text or variations.`;

        const messages = [
            { role: 'system', content: `You are a smart aptitude quiz generator.` },
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

        const parsedQuestions = parseResponse(responseContent.trim());
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
