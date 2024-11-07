const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const Event = require('../models/Event');
const UserProfile = require('../models/UserProfile');
const emailService = require('../services/emailService');

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

// POST route for creating events
router.post('/', cors(corsOptions), upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const uploadResponse = await cloudinary.uploader.upload(fileStr);
      imageUrl = uploadResponse.secure_url;
    }

    const newEvent = new Event({
      ...req.body,
      imageUrl
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/rsvp", cors(corsOptions), async (req, res) => {
  try {
    console.log('RSVP Request:', {
      body: req.body,
      eventId: req.params.id
    });

    // Validate required fields
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Find the event
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check for duplicate RSVP
    const normalizedEmail = email.toLowerCase().trim();
    const existingRSVP = event.rsvps.find(rsvp => 
      rsvp.email.toLowerCase().trim() === normalizedEmail
    );

    if (existingRSVP) {
      return res.status(400).json({ message: "You have already RSVP'd for this event" });
    }

    // Create new RSVP
    const newRSVP = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      createdAt: new Date()
    };

    // Add RSVP to event
    event.rsvps.push(newRSVP);
    await event.save();

    // Send email confirmation
    try {
      const emailService = require('../services/emailService');
      await emailService.sendRSVPConfirmation(event, newRSVP);
      
      res.status(201).json({
        message: "RSVP successful and confirmation email sent",
        rsvp: newRSVP
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      
      res.status(201).json({
        message: "RSVP successful, but there was an issue sending the confirmation email",
        rsvp: newRSVP
      });
    }
  } catch (error) {
    console.error('Error in RSVP route:', error);
    res.status(500).json({ 
      message: "An error occurred while processing your RSVP",
      error: error.message 
    });
  }
});

// GET route for retrieving events
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skipIndex = (page - 1) * limit;

    const events = await Event.find()
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit)
      .exec();

    const total = await Event.countDocuments();

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET route for retrieving a specific event by ID
router.get('/getById/:id', async (req, res) => {
  try {
    // Validate event ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid event ID format" });
    }
    res.status(500).json({ message: error.message });
  }
});



router.post('/profile/save', cors(corsOptions), async (req, res) => {
  const {
    fullName,
    gender,
    country,
    language,
    emailAddresses,
    phoneNumber,
    interests,
    address,
    imageUrl,
  } = req.body;
  console.log(req.body);
  try {
    // Check if a profile with this email already exists
    let userProfile = await UserProfile.findOne({ emailAddresses });

    if (userProfile) {
      // Update existing profile
      userProfile = await UserProfile.findOneAndUpdate(
        { emailAddresses },
        {
          fullName,
          gender,
          country,
          language,
          phoneNumber,
          interests,
          address,
          imageUrl,
        },
        { new: true }
      );
    } else {
      // Create new profile
      userProfile = new UserProfile({
        fullName,
        gender,
        country,
        language,
        emailAddresses,
        phoneNumber,
        interests,
        address,
        imageUrl,
      });
      await userProfile.save();
    }

    res.status(201).json(userProfile);
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ message: "Error saving profile", error: error.message });
  }
});


router.get('/profile', cors(corsOptions), async (req, res) => {
  const { email } = req.query; // Retrieve email from query parameters

  try {
    // Find the user profile by email
    const userProfile = await UserProfile.findOne({ emailAddresses: email });
    
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

module.exports = router;