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

// MongoDB Connection Logic
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing!');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err;
    }
};

// Middleware to ensure DB is connected before every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ 
            message: "Database connection failed", 
            error: err.message 
        });
    }
});

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
