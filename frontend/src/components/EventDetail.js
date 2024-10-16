import React from 'react';
import '../styles/EventDetail.css';
import RSVPForm from './RSVPForm';
import eventImage from '../Images/eventItem.png';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import EventDetailMid from "./EventDetailMid";
import EventCatalog from "./EventCatalog"; // Add social media icons
import { useNavigate } from 'react-router-dom';


function EventDetail() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Goes back to the previous page
    };

    return (
        <div>
            <div className="event-detail-page">
                {/* Background image */}
                <div className="background-overlay" style={{backgroundImage: `url(${eventImage})`}}></div>

                {/* Back button at top left */}
                <button className="back-button" onClick={handleGoBack}>← Back</button>

                <div className="event-content">
                    {/* Left side: Event heading and details */}
                    <div className="event-info">
                        <h1>Dream World Wide in Jakarta</h1>
                        <p>Virginia Tech</p>
                        <p>Description of the event goes here. It's suitable for both beginners and experienced
                            users...</p>
                    </div>

                    {/* Right side: Date, Time, Location and RSVP */}
                    <div className="event-details-box">
                        <h4>Date & Time</h4>
                        <p className="text-grayed">Saturday, March 18, 2023, 9:30 PM</p>

                        <a className="add-to-calendar">Add to calendar</a>

                        {/* <button className="rsvp-button">RSVP for the Event</button> */}
                        <RSVPForm eventTitle="Dream World Wide in Jakarta" />
                    </div>
                </div>
            </div>
            <EventDetailMid />
            <span className={"event-details-suggestions-heading"}>Events you may Like</span>
            <EventCatalog />
        </div>

    );
}

export default EventDetail;
