const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
}

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 10
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
});

// Disable buffering to prevent long hangs if connection fails
mongoose.set('bufferCommands', false);

// Routes
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));


// Basic Route
app.get('/', (req, res) => {
    res.send('Bill Management API is running...');
});


// Start Server (local dev only)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
