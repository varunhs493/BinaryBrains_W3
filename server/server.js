// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to Database with error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Define Routes - wrapped in try/catch to prevent crashes if modules are missing
    try {
      app.use('/api/users', require('./routes/users'));
      console.log('Users routes loaded');
    } catch (err) {
      console.error('Error loading users routes:', err.message);
    }

    try {
      app.use('/api/auth', require('./routes/auth'));
      console.log('Auth routes loaded');
    } catch (err) {
      console.error('Error loading auth routes:', err.message);
    }

    // Ensure donations route exists
    if (fs.existsSync('./routes/donations.js')) {
      app.use('/api/donate', require('./routes/donations'));
      console.log('✅ Donation routes loaded');
    } else {
      console.log('❌ Donations route file not found - skipping');
    }

    // Default API Route
    app.get('/', (req, res) => res.send('API is running...'));

    // Serve Frontend in Production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client')));

      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
      });
    }

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
