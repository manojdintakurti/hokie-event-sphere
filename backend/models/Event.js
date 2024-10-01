const mongoose =  require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  attendees: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}); 

module.exports = mongoose.model('Event', EventSchema);