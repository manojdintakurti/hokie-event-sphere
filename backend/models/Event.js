const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  organizerId: { type: String, required: true },
  // New fields for categories
  main_category: { type: String, default: 'Others' },
  sub_category: { type: String, default: 'Miscellaneous Events' },
  // New location field
  location: {
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 }
    }
  },
  // Keep this for deduplication
  ticketmaster_id: { type: String, sparse: true },
  rsvps:[{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    createdAt: { type: Date, default: Date.now },
  }]
}, { timestamps: true }); // This adds createdAt and updatedAt fields

// Add indexes for location-based queries
eventSchema.index({ 'location.coordinates': '2d' });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ 'location.state': 1 });
eventSchema.index({ ticketmaster_id: 1 }, { sparse: true });

module.exports = mongoose.model('Event', eventSchema);