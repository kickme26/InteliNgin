// fetchQuestions.js
const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions'); // Adjust URL as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  };
  
  module.exports = { fetchQuestions };
  