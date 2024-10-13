import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import "../styles/createEvent.css"
// import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: '',
    venue: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    registrationFee: '',
    organizerEmail: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });
    if (image) {
      formData.append('image', image);
    }
    formData.append('organizerId', userId);

    try {
      const token = await getToken();
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/events`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
        },
        withCredentials: true
      });
      console.log('Event created:', response.data);
      navigate('/events'); 
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      setError(`Failed to create event: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h1>Create Event</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="venue">Event Venue*</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startTime">Start time*</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endTime">End time*</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startDate">Start date*</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endDate">End date*</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="registrationFee">Event Registration Fee</label>
          <input
            type="number"
            id="registrationFee"
            name="registrationFee"
            value={eventData.registrationFee}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="organizerEmail">Organizer Email*</label>
          <input
            type="email"
            id="organizerEmail"
            name="organizerEmail"
            value={eventData.organizerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Event Description*</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Event Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="create-event-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create event'}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;