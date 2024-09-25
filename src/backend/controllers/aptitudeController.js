const aptitudeService = require('../services/aptitudeService');

const fetchAptitudeQuestions = async (req, res) => {
  const { difficulty } = req.params;

  try {
    const questions = await aptitudeService.getAptitudeQuestions(difficulty);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch aptitude questions.' });
  }
};

module.exports = {
  fetchAptitudeQuestions
};
