const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Clerk authentication middleware
const clerkAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/events', clerkAuth, require('./routes/events'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});