import React from 'react';
import '../styles/EventCatalog.css';

import eventImage from '../Images/eventItem.png';

const events = [
    { id: 1, title: "Event 1", time: "12:00 PM", date: "Oct 20", location: "New York", type: "In-Person", image: eventImage },
    { id: 2, title: "Event 2", time: "1:00 PM", date: "Oct 22", location: "Chicago", type: "Online", image: eventImage },
    { id: 3, title: "Event 1", time: "12:00 PM", date: "Oct 20", location: "New York", type: "In-Person", image: eventImage },
    { id: 4, title: "Event 2", time: "1:00 PM", date: "Oct 22", location: "Chicago", type: "Online", image: eventImage },
    { id: 5, title: "Event 1", time: "12:00 PM", date: "Oct 20", location: "New York", type: "In-Person", image: eventImage },
    { id: 6, title: "Event 2", time: "1:00 PM", date: "Oct 22", location: "Chicago", type: "Online", image: eventImage },
    { id: 7, title: "Event 1", time: "12:00 PM", date: "Oct 20", location: "New York", type: "In-Person", image: eventImage },
    { id: 8, title: "Event 2", time: "1:00 PM", date: "Oct 22", location: "Chicago", type: "Online", image: eventImage },
];

function EventCatalog() {
    return (
        <div className="catalog-container">
            {events.map(event => (
                <div className="event-box" key={event.id}>
                    <div className="image-wrapper">
                        <img src={event.image} alt={event.title} className="event-image" />
                    </div>
                    <div className="event-info">
                        <h3>{event.title}</h3>
                        <p className="event-details">
                            {event.date} at {event.time}
                        </p>
                        <p className="event-location">
                            {event.location} - {event.type}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EventCatalog;
