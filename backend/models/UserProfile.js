const mongoose = require('mongoose');
const Event = require('./Event'); // Import the Event model

const userProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailAddresses: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    }
  },
  interests: [String],
  imageUrl: { type: String },
  gender: { type: String },
  language: { type: String },
  rsvps: [
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
      },
      status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }, // RSVP status
      registeredAt: { type: Date, default: Date.now } // Timestamp for when the RSVP was made
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
