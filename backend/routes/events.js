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
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

// POST event RSVP route
router.post("/:id/rsvp", cors(corsOptions), async (req, res) => {
  try {
    console.log('RSVP Request:', {
      body: req.body,
      eventId: req.params.id
    });

    // Validate required fields
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ 
        message: "Name and email are required",
        validationError: true
      });
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
      console.log('Duplicate RSVP detected:', {
        email: normalizedEmail,
        existingRSVP
      });
      
      return res.status(400).json({ 
        message: "You have already RSVP'd for this event",
        duplicate: true
      });
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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: `RSVP Confirmation - ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>RSVP Confirmation</h2>
            <p>Hello ${name},</p>
            <p>Your RSVP for "${event.title}" has been confirmed.</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <h3>Event Details:</h3>
              <p><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
              <p><strong>Venue:</strong> ${event.venue}</p>
            </div>
            <p>If you have any questions, please contact the organizer at ${event.organizerEmail}</p>
          </div>
        `
      });

      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with success response even if email fails
    }

    // Send success response
    res.status(201).json({
      message: "RSVP successful! A confirmation email has been sent to your email address.",
      rsvp: newRSVP
    });

  } catch (error) {
    console.error('Error in RSVP route:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid event ID format",
        details: error.message 
      });
    }

    res.status(500).json({ 
      message: "An error occurred while processing your RSVP. Please try again.",
      details: error.message
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