import React, { useEffect, useState } from "react";
import "../styles/Recommendations.css"; // Create this file for styling
import { Link } from "react-router-dom";

const EventRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const email = sessionStorage.getItem("userEmail")
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/api/events/recommended?email=${email}`
                ); // Add the email as a query parameter
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                setRecommendations(data.recommendations);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Conditional rendering
    if (loading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="event-recommendations">
            <h2>Recommendations for You</h2>
            <div className="event-cards">
                {recommendations.slice(0,5)?.map((event, index) => (
                    <Link
                        to={`/event-detail/${event.eventId}`}
                        key={event.eventId}
                        className={"recomendations-card"}
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        }}
                    >
                    <div key={index} className="event-card">
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="event-image"
                        />
                        <div className="event-details">
                            <h3 className="event-title">{event.title}</h3>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EventRecommendations;
