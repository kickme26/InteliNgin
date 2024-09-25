// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const loginRoutes = require('./routes/loginRoutes');
const aptitudeRoutes = require('./routes/aptitudeRoutes');
const chatRoutes = require('./routes/chatRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(bodyParser.json());

// Set up routes
app.use('/api/admin', adminRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
