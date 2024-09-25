const loginService = require('../services/loginService');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Validate login credentials
    const isAuthenticated = await loginService.authenticateUser(username, password);
    if (isAuthenticated) {
      res.status(200).json({ message: 'Login successful', username });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  handleLogin
};
