import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/createEvent.css';

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
    image: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setEventData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(eventData);
    // Navigate back to home or events page after submission
    navigate('/');
  };

  return (
    <div className="create-event-container">
      <h1>Create Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input type="text" id="title" name="title" value={eventData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="venue">Event Venue*</label>
          <input type="text" id="venue" name="venue" value={eventData.venue} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startTime">Start time*</label>
            <input type="time" id="startTime" name="startTime" value={eventData.startTime} onChange={handleChange} required />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endTime">End time*</label>
            <input type="time" id="endTime" name="endTime" value={eventData.endTime} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startDate">Start date*</label>
            <input type="date" id="startDate" name="startDate" value={eventData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endDate">End date*</label>
            <input type="date" id="endDate" name="endDate" value={eventData.endDate} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="registrationFee">Event Registration Fee</label>
          <input type="number" id="registrationFee" name="registrationFee" value={eventData.registrationFee} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="organizerEmail">Organizer Mail Id</label>
          <input type="email" id="organizerEmail" name="organizerEmail" value={eventData.organizerEmail} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="image">Event Image</label>
          <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea id="description" name="description" value={eventData.description} onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="create-event-button">Create event</button>
      </form>
    </div>
  );
}

export default CreateEvent;