require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/residents', require('./routes/residents'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/gatekeepers', require('./routes/gatekeepers'));
app.use('/api/help', require('./routes/help'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/profile', require('./routes/profile'));

// Basic route
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
