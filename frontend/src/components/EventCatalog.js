import React, { useState, useEffect } from 'react';
import '../styles/EventCatalog.css';
import { Link } from 'react-router-dom';

function EventCatalog() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchEvents = (page) => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events?page=${page}&limit=12`)
            .then(response => response.json())
            .then(data => {
                setEvents(data.events);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents(1); // Initial load for page 1
    }, []);

    const handlePageChange = (newPage) => {
        fetchEvents(newPage);
    };

    return (

        <div>
            <div className="catalog-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Loading events...</p>
                    </div>
                ) : (
                    <>
                        {events.length > 0 ? (
                            events.map(event => (
                                <Link to={`/event-detail/${event._id}`} className="event-box" key={event._id}>
                                    <div className="image-wrapper">
                                        <img src={event.imageUrl} alt={event.title} className="event-image"/>
                                    </div>
                                    <div className="event-info">
                                        <h3>{event.title}</h3>
                                        <p className="event-details">
                                            {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                                        </p>
                                        <p className="event-location">
                                            {event.venue}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}


                    </>
                )}
            </div>
            {/* Pagination controls */}
            <div className="pagination">
                {currentPage > 1 && (
                    <button onClick={() => handlePageChange(currentPage - 1)}>
                        Previous
                    </button>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}

export default EventCatalog;
