import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to access URL params
import '../styles/EventDetail.css';
import RSVPForm from './RSVPForm';
import EventDetailMid from "./EventDetailMid";
import EventCatalog from "./EventCatalog";
import 'add-to-calendar-button';


function EventDetail() {
    const { eventId } = useParams(); // Get the event ID from the URL
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling description
    const toggleDescription = () => {
        setShowFullDescription(prevState => !prevState);
    };
    const renderDescription = (description) => {
        // Check if description is more than 5 lines (rough estimate with character length)
        const maxLength = 300; // Adjust this length based on average line size
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

    useEffect(() => {
        // Fetch the specific event based on eventId
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}`)
            .then(response => response.json())
            .then(data => {
                setEvent(data); // Set the fetched event data to state
                setLoading(false);

                console.log('Fetched event:', data);
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                setLoading(false);
            });
    }, [eventId]);

    const handleGoBack = () => {
        navigate(-1); 
    };

    if (loading) {
        return <div>Loading event details...</div>;
    }

    if (!event) {
        return <div>Event not found.</div>;
    }

    return (
        <div>
            <div className="event-detail-page">
                {/* Background image */}
                <div className="background-overlay" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>

                {/* Back button at top left */}
                <button className="back-button" onClick={handleGoBack}>← Back</button>

                <div className="event-content">
                    {/* Left side: Event heading and details */}
                    <div className="event-info">
                        <h1>{event.title}</h1>
                        {/* <p>{event.venue}</p>
                        <p>{renderDescription(event.description)}</p> */}
                    </div>

                    {/* Right side: Date, Time, Location and RSVP */}
                    <div className="event-details-box">
                        <h4>Date & Time</h4>
                        <p className="text-grayed">
                            {new Date(event.startDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }).replace(/(\d+)(?=\b)/, function (day) {
                                // Add ordinal suffix to the day
                                let j = day % 10, k = day % 100;
                                if (j === 1 && k !== 11) return day + "st";
                                if (j === 2 && k !== 12) return day + "nd";
                                if (j === 3 && k !== 13) return day + "rd";
                                return day + "th";
                            })}, {new Date(event.startDate + ' ' + event.startTime).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}
                        </p>
                        {/* Add-to-Calendar Button */}
                        <add-to-calendar-button
                            name={event.title}
                            options="'Apple','Google'"
                            location={event.venue}
                            startDate={new Date(event.startDate).toISOString().split('T')[0]}
                            endDate={new Date(event.endDate).toISOString().split('T')[0]}
                            startTime={event.startTime}
                            endTime={event.endTime}
                            timeZone="America/Los_Angeles"
                        ></add-to-calendar-button>
                        <RSVPForm eventTitle={event.title} eventId={event._id}/>
                    </div>
                </div>
            </div>
            <EventDetailMid
                description={event.description}
                eventDate={new Date(event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }).replace(/(\d+)(?=\b)/, function (day) {
                    let j = day % 10, k = day % 100;
                    if (j === 1 && k !== 11) return day + "st";
                    if (j === 2 && k !== 12) return day + "nd";
                    if (j === 3 && k !== 13) return day + "rd";
                    return day + "th";
                })}
                eventTime={new Date(event.startDate + ' ' + event.startTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })}
                weekdayHours={"9 AM - 5 PM"}
                sundayHours={"9 AM - 12 PM"}
                organizerEmail={event.organizerEmail}
                registrationFee={event.registrationFee}
                venue={event.venue}
            />
            <span className={"event-details-suggestions-heading"}>Events you may like</span>
            <EventCatalog/>
        </div>
    );
}

export default EventDetail;
