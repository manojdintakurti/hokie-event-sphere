const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const Event = require('../models/Event');

const upload = multer({ dest: 'uploads/' });

const corsOptions = {
  origin: 'http://localhost:3000', // or your frontend URL
  optionsSuccessStatus: 200
};

router.post('/', cors(corsOptions), upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newEvent = new Event({
      ...req.body,
      imageUrl
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;