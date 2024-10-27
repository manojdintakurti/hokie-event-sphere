import React, { useState, useEffect } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from 'react-share';
import "../styles/EventDetail.css";

function EventDetailMid(props) {
    const {
        description,
        eventDate,
        eventTime,
        weekdayHours,
        sundayHours,
        organizerEmail,
        registrationFee,
        venue,
        eventTitle
    } = props;

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [locationUrl, setLocationUrl] = useState("");
    const [error, setError] = useState(null);

    const toggleDescription = () => {
        setShowFullDescription(prevState => !prevState);
    };

    const renderDescription = (description) => {
        const maxLength = 300;
        if (description.length > maxLength) {
            return (
                <>
                    {showFullDescription ? description : `${description.substring(0, maxLength)}...`}
                    <button className="read-more-btn" onClick={toggleDescription}>
                        {showFullDescription ? 'Read Less' : 'Read More'}
                    </button>
                </>
            );
        }
        return description;
    };

    const shareUrl = window.location.href;
    const title = eventTitle || "Join this exciting event!";

    useEffect(() => {
        const apiKey = "AIzaSyCO3BUVFeZVl6K-9n_M76ptwplqj9cEIAk";
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(venue)}&key=${apiKey}`;

        fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === "OK") {
                    const { lat, lng } = data.results[0].geometry.location;
                    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=14`;
                    setLocationUrl(mapUrl);
                } else {
                    setError("Location not found");
                }
            })
            .catch(() => {
                setError("Failed to fetch location data");
            });
    }, [venue]);

    return (
        <div className="additional-details">
            {/* Left side: Event description, hours, organizers, and fees */}
            <div className="event-left-section">
                <h4>Description</h4>
                <p>{renderDescription(description)}</p>

                <h4>Event Date & Time</h4>
                <p>{eventDate}, {eventTime}</p>

                <h4>Hours</h4>
                <p>Weekdays hour: <span className="highlight">{weekdayHours}</span></p>
                <p>Sunday hour: <span className="highlight">{sundayHours}</span></p>

                <h4>Organizer Contact</h4>
                <p>Please contact <a href={`mailto:${organizerEmail}`} target="_blank"
                                   rel="noopener noreferrer">{organizerEmail}</a> for more details.</p>

                <h4>Registration Fee</h4>
                <p>${registrationFee}</p>
            </div>

            {/* Right side: Map location and social media sharing */}
            <div className="event-right-section">
                <h4>Location</h4>
                <div className="map-container">
                    {locationUrl ? (
                        <iframe
                            src={locationUrl}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Event Location"
                        ></iframe>
                    ) : (
                        <p>{error || "Loading map..."}</p>
                    )}
                </div>
                {/* Venue Address below the map */}
                <p className="venue-address">{venue}</p>

                <h4>Share with Friends</h4>
                <div className="social-media-icons">
                    {/* Social Share Buttons */}
                    <FacebookShareButton url={shareUrl} quote={title}>
                        <FaFacebook className="icon" />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={title}>
                        <FaTwitter className="icon" />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} title={title}>
                        <FaLinkedin className="icon" />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={title}>
                        <FaWhatsapp className="icon" />
                    </WhatsappShareButton>
                </div>
            </div>
        </div>
    );
}

export default EventDetailMid;