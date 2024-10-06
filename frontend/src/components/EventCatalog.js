import React from 'react';
import '../styles/EventCatalog.css';

function EventCatalog() {
    const events = [
        { id: 1, title: "Event 1", time: "12:00 PM", date: "Oct 20", location: "New York", image: "/event1.png" },
        { id: 2, title: "Event 2", time: "1:00 PM", date: "Oct 22", location: "Chicago", image: "/event2.png" },
        // Add more events
    ];

    return (
        <div className="catalog-container">
            {events.map(event => (
                <div className="event-box" key={event.id}>
                    <img src={event.image} alt={event.title} className="event-image" />
                    <div className="event-info">
                        <h3>{event.title}</h3>
                        <p>{event.date} at {event.time}</p>
                        <p>{event.location}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EventCatalog;
