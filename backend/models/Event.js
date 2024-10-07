const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationFee: { type: Number },
  organizerEmail: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  organizerId: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);