const Groq = require('groq-sdk');

// Initialize GROQ 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 client with the API key directly
const apiKey = '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';
const groq = new Groq({ apiKey });

console.log('GROQ client initialized with API key:', apiKey);

module.exports = groq;
