import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../styles/createEvent.css";

function CreateEvent() {
  const initialFormState = {
    title: "",
    venue: "",
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    registrationFee: "",
    organizerEmail: "",
    description: "",
  };

  const [eventData, setEventData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const { getToken, userId } = useAuth();
  const navigate = useNavigate();

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Title validation
    if (!eventData.title.trim()) {
      errors.title = "Title is required";
    }

    // Date validation
    if (eventData.startDate && eventData.endDate) {
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);
      if (endDate < startDate) {
        errors.endDate = "End date cannot be before start date";
      }
    }

    // Time validation
    if (
      eventData.startDate === eventData.endDate &&
      eventData.startTime &&
      eventData.endTime
    ) {
      if (eventData.endTime <= eventData.startTime) {
        errors.endTime = "End time must be after start time";
      }
    }

    // Registration fee validation
    if (eventData.registrationFee && Number(eventData.registrationFee) < 0) {
      errors.registrationFee = "Registration fee cannot be negative";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(eventData.organizerEmail)) {
      errors.organizerEmail = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Validate file size (e.g., 1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleGoBack = () => {
    if (
      Object.keys(eventData).some(
        (key) => eventData[key] !== initialFormState[key]
      ) ||
      image
    ) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    const formData = new FormData();

    Object.keys(eventData).forEach((key) => {
      formData.append(key, eventData[key]);
    });

    if (image) {
      formData.append("image", image);
    }
    formData.append("organizerId", userId);

    try {
      const token = await getToken();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Event created:", response.data);
      // Show success message before navigating
      alert("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Failed to create event: ${errorMessage}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h1>Create Event</h1>
      <button className="back-button" onClick={handleGoBack}>
        ← Back
      </button>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className={formErrors.title ? "error" : ""}
            placeholder="Enter event title"
          />
          {formErrors.title && (
            <span className="error-text">{formErrors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="venue">Event Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            placeholder="Enter event venue"
          />
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startTime">Start time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endTime">End time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              className={formErrors.endTime ? "error" : ""}
            />
            {formErrors.endTime && (
              <span className="error-text">{formErrors.endTime}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half-width">
            <label htmlFor="startDate">Start date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="form-group half-width">
            <label htmlFor="endDate">End date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              min={
                eventData.startDate || new Date().toISOString().split("T")[0]
              }
              className={formErrors.endDate ? "error" : ""}
            />
            {formErrors.endDate && (
              <span className="error-text">{formErrors.endDate}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="registrationFee">Event Registration Fee ($)</label>
          <input
            type="number"
            id="registrationFee"
            name="registrationFee"
            value={eventData.registrationFee}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Enter registration fee (optional)"
            className={formErrors.registrationFee ? "error" : ""}
          />
          {formErrors.registrationFee && (
            <span className="error-text">{formErrors.registrationFee}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="organizerEmail">Organizer Email</label>
          <input
            type="email"
            id="organizerEmail"
            name="organizerEmail"
            value={eventData.organizerEmail}
            onChange={handleChange}
            placeholder="Enter organizer email"
            className={formErrors.organizerEmail ? "error" : ""}
          />
          {formErrors.organizerEmail && (
            <span className="error-text">{formErrors.organizerEmail}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows="5"
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
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="create-event-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
