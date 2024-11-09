import React, { useState, useEffect } from "react";
import "../styles/EventCatalog.css";
import { Link, useLocation } from "react-router-dom";

function EventCatalog({ selectedCategory }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
    // This will run whenever the location changes
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  const fetchEvents = (page = 1) => {
    setLoading(true);
    const categoryQuery = selectedCategory ? `&category=${selectedCategory} Events` : "";
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/events?page=${page}&limit=12${categoryQuery}`
    )
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents(currentPage); // Fetch events on initial load and whenever the category or page changes
  }, [selectedCategory, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
              events.map((event) => (
                <Link
                  to={`/event-detail/${event._id}`}
                  className="event-box"
                  key={event._id}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <div className="image-wrapper">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="event-image"
                    />
                  </div>
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-details">
                      {new Date(event.startDate).toLocaleDateString()} at{" "}
                      {event.startTime}
                    </p>
                    <p className="event-location">{event.venue}</p>
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
