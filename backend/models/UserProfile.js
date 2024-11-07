const mongoose = require('mongoose');

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
  },
  interests: [String],
  imageUrl: { type: String },
  gender: { type: String },
  language: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
