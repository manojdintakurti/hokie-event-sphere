require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const eventRoutes = require('./routes/events');
const cors = require('cors');

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// CORS middleware
app.use(cors({
  origin: 'https://hokie-event-sphere.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'events_db', // Force connection to events_db
}).then(() => {
  console.log('Successfully connected to MongoDB Atlas - Database: events_db');
  // Log additional connection details
  const connection = mongoose.connection;
  console.log('Current database:', connection.db.databaseName);
}).catch((error) => {
  console.error('MongoDB Atlas connection error:', error);
});

app.use('/api/events', eventRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5002; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

