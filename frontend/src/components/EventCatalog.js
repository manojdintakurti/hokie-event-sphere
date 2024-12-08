import React, { useState, useEffect } from "react";
import "../styles/EventCatalog.css";
import { Link, useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function EventCatalog({ selectedCategory }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();

  useEffect(() => {
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
    fetchEvents(currentPage);
  }, [selectedCategory, currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
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
                      className="event-image-cat"
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

      <div className="pagination-container-main">
          <Stack spacing={2} className="pagination-container">
                  <Pagination
                    className="pagination"
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
          </Stack>
      </div>
    </div>
  );
}

export default EventCatalog;
