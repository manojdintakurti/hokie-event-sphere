const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const Event = require('../models/Event');
const UserProfile = require('../models/UserProfile');
const ClickCount = require('../models/ClickCount');
const axios = require('axios');

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
      console.error('Error calling categorizer:', error);
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

    // Check for duplicate RSVP in the event
    const normalizedEmail = email.toLowerCase().trim();
    const existingRSVP = event.rsvps.find(rsvp =>
        rsvp.email.toLowerCase().trim() === normalizedEmail
    );

    if (existingRSVP) {
      return res.status(400).json({ message: "You have already RSVP'd for this event" });
    }

    // Create new RSVP for the event
    const newRSVP = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      createdAt: new Date()
    };

    // Add RSVP to event
    event.rsvps.push(newRSVP);
    await event.save();
    // Add RSVP to user profile
    try {
      const user = await UserProfile.findOne({ emailAddresses: normalizedEmail });
      if (user) {
        // Check if the event is already in the user's RSVP list
        const userExistingRSVP = user.rsvps.find(
            (rsvp) => rsvp.event._id.toString() === event._id.toString()
        );

        if (!userExistingRSVP) {
          // Add the full event to the user's RSVP list
          user.rsvps.push({
            event: event.toObject(), // Convert Mongoose document to plain object
            status: "Confirmed", // Default status for RSVP
            registeredAt: new Date()
          });
          await user.save();
          console.log(user);
        }
      } else {
        console.warn(`User with email ${normalizedEmail} not found. Skipping user profile update.`);
      }
    } catch (userError) {
      console.error('Error updating user profile:', userError);
      // Continue without failing the RSVP creation if the user profile update fails
    }

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

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skipIndex = (page - 1) * limit;
    const main_category = req.query.category;

    // Explicitly define the filter object
    const filter = main_category ? { main_category: main_category } : {};
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit)
      .exec();

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total,
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


const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;
async function getCoordinatesFromAddress(address) {
  try {
    const { street, city, state, postalCode, country } = address;
    const query = `${street}, ${city}, ${state}, ${postalCode}, ${country}`;

    console.log("Making request to OpenCage with query:", query);
    console.log("Using API Key:", GEOCODING_API_KEY);

    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        q: query,
        key: GEOCODING_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      console.log("Coordinates fetched:", { latitude: lat, longitude: lng });
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("No results found for the given address.");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response from OpenCage API:", error.response.status, error.response.data);
    } else {
      console.error("Error fetching coordinates:", error.message);
    }
    throw error;
  }
}

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
  try {
    let userProfile = await UserProfile.findOne({ emailAddresses });

    // Extract coordinates if available; otherwise, generate them
    let { street, city, state, postalCode, country: addressCountry, coordinates } = address || {};
    let latitude = coordinates?.latitude || null;
    let longitude = coordinates?.longitude || null;

    if (!latitude || !longitude) {
      const newCoordinates = await getCoordinatesFromAddress({
        street,
        city,
        state,
        postalCode,
        country: addressCountry,
      });
      latitude = newCoordinates.latitude;
      longitude = newCoordinates.longitude;
    }

    const updatedAddress = {
      street,
      city,
      state,
      postalCode,
      country: addressCountry,
      coordinates: { latitude, longitude },
    };

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
            address: updatedAddress,
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
        address: updatedAddress,
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

// Route to log or increment click count
router.post('/log-click', async (req, res) => {
  const { userId, category, subcategory } = req.body;
  console.log(req.body);

  if (!userId || !category || !subcategory) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Get user profile to validate user existence
    const userProfile = await UserProfile.findOne({ emailAddresses: userId }); // Assuming userId is an email
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create the document for the user
    let clickCountDoc = await ClickCount.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId, categories: [] } }, // If not found, initialize with empty categories
        { new: true, upsert: true }
    );

    // Check if the category exists in the user's record
    const categoryIndex = clickCountDoc.categories.findIndex(
        (cat) => cat.category === category
    );

    if (categoryIndex >= 0) {
      // Category exists, increment its count
      clickCountDoc.categories[categoryIndex].categoryCount += 1;

      // Check if the subcategory exists within this category
      const subCategoryIndex = clickCountDoc.categories[categoryIndex].subCategories.findIndex(
          (sub) => sub.subCategory === subcategory
      );

      if (subCategoryIndex >= 0) {
        // Subcategory exists, increment its count
        clickCountDoc.categories[categoryIndex].subCategories[subCategoryIndex].subCategoryCount += 1;
      } else {
        // Subcategory does not exist, add it
        clickCountDoc.categories[categoryIndex].subCategories.push({
          subCategory: subcategory,
          subCategoryCount: 1
        });
      }
    } else {
      // Category does not exist, add it with the subcategory
      clickCountDoc.categories.push({
        category,
        categoryCount: 1,
        subCategories: [
          {
            subCategory: subcategory,
            subCategoryCount: 1
          }
        ]
      });
    }

    // Save the updated document
    await clickCountDoc.save();

    res.status(201).json({ message: 'Click count updated successfully', clickCountDoc });
  } catch (error) {
    console.error('Error updating click count:', error);
    res.status(500).json({ message: 'Error updating click count', error });
  }
});

// recommendation routes
router.get('/recommended', async (req, res) => {
  try {
      const { email, latitude, longitude, limit = 10 } = req.query;
      if (!email) {
          return res.status(400).json({ 
              message: "Missing required parameter: userId" 
          });
      }

      // Get user profile
    const userProfile = await UserProfile.findOne({ emailAddresses: email });
      if (!userProfile) {
          return res.status(404).json({ message: "User profile not found" });
      }

      const userEmail = userProfile.emailAddresses;
      const userLat = latitude || userProfile.address?.coordinates?.latitude;
      const userLon = longitude || userProfile.address?.coordinates?.longitude;
      const userId = userProfile._id

      // Call FastAPI recommendation service
      const response = await axios.get(
          `${process.env.FASTAPI_URL}/recommendations/${userId}`,
          {
              params: {
                  user_email: userEmail,
                  latitude: userLat,
                  longitude: userLon,
                  limit
              }
          }
      );

      // Return the recommendations directly from FastAPI
      return res.json(response.data);

  } catch (error) {
      console.error('Error getting recommendations:', error?.response?.data || error);
      res.status(500).json({ 
          message: "Error fetching recommendations",
          error: error?.response?.data?.detail || error.message
      });
  }
});

module.exports = router;