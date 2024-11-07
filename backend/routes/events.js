const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const Event = require('../models/Event');
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

    try {
      //calling fastapi function to categorize event
      const categorizerResponse = await axios.post(
        `${process.env.FASTAPI_URL}/categorize/${savedEvent._id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (categorizerResponse.data.success && categorizerResponse.data.data) {
        // Update the event with the categorization results
        const updatedEvent = await Event.findByIdAndUpdate(
          savedEvent._id,
          {
          main_category: categorizerResponse.data.data.main_category,
          sub_category: categorizerResponse.data.data.sub_category,
          description: categorizerResponse.data.data.description 
          },
          { new : true} // return the updated document
        );
        res.status(201).json(updatedEvent);
      } else {
        // If categorization fails, still return the saved event
        console.warn('Event categorization failed:', categorizerResponse.data.error);
        res.status(201).json(savedEvent);
      }
    } catch (error) {
      // If categorizer call fails, log the error but still return the saved event
      console.error('Error calling categorizer:', categorizerError);
      res.status(201).json(savedEvent);
    }
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
router.get('/:id', async (req, res) => {
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

module.exports = router;