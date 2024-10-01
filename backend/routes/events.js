const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create a new event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = new Event({ title, description, date, location, organizer: req.auth.userId });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific event by ID
router.get('/:id', async (req, res) => {
    res.json(res.event);
});

// Update an event by ID
router.patch('/:id',getEvent, async (req, res) => {
    if (req.body.title != null) {
        res.event.title = req.body.title;
    }
    if (req.body.description != null) {
        res.event.description = req.body.description;
    }
    if (req.body.date != null) {
        res.event.date = req.body.date;
    }
    if (req.body.location != null) {
        res.event.location = req.body.location;
    }
    try {
        const updatedEvent = await res.event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Delete an event by ID
router.delete('/:id', getEvent, async (req, res) => {
    try {
      await res.event.remove();
      res.json({ message: 'Event deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

//Middleware function to get event by ID
async function getEvent(req, res, next) {
    let event;
    try {
      event = await Event.findById(req.params.id);
      if (event == null) {
        return res.status(404).json({ message: 'Cannot find event' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.event = event;
    next();
}

module.exports = router;
  

