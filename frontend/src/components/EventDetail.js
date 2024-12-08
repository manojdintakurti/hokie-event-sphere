import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams to access URL params
import "../styles/EventDetail.css";
import RSVPForm from "./RSVPForm";
import EventDetailMid from "./EventDetailMid";
import EventCatalog from "./EventCatalog";
import "add-to-calendar-button";


function EventDetail() {
  const { eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling description
  const toggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events/getById/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
        logClickCount(data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [eventId]);
  const logClickCount = (eventData) => {
    if (!eventData) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events/log-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem("userEmail"),
        category: eventData.main_category,
        subcategory: eventData.sub_category,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Click count logged:", data);
      })
      .catch((error) => {
        console.error("Error logging click count:", error);
      });
  };

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
        <div
          className="background-overlay"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        ></div>

        {/* Back button at top left */}
        <button className="back-button" onClick={handleGoBack}>
          ← Back
        </button>

        <div className="event-content">
          {/* Left side: Event heading and details */}
          <div className="event-info-details">
            <h1>{event.title}</h1>
          </div>

          {/* Right side: Date, Time, Location and RSVP */}
          <div className="event-details-box">
            <h4>Date & Time</h4>
            <p className="text-grayed">
              {(() => {
                try {
                  const date = new Date(event.startDate);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  // Add ordinal suffix to day
                  const withOrdinal = formattedDate.replace(
                    /(\d+)(?=\b)/,
                    (day) => {
                      const j = parseInt(day) % 10;
                      const k = parseInt(day) % 100;
                      if (j === 1 && k !== 11) return day + "st";
                      if (j === 2 && k !== 12) return day + "nd";
                      if (j === 3 && k !== 13) return day + "rd";
                      return day + "th";
                    }
                  );

                  // Format time
                  const [hours, minutes] = event.startTime.split(":");
                  const time = new Date();
                  time.setHours(parseInt(hours), parseInt(minutes));
                  const formattedTime = time.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  });

                  return `${withOrdinal}, ${formattedTime}`;
                } catch (error) {
                  console.error("Date formatting error:", error);
                  return "Date and time not available";
                }
              })()}
            </p>
            {/* Add-to-Calendar Button */}
            <add-to-calendar-button
              name={event.title}
              options="'Apple','Google'"
              location={event.venue}
              startDate={new Date(event.startDate).toISOString().split("T")[0]}
              endDate={new Date(event.endDate).toISOString().split("T")[0]}
              startTime={event.startTime}
              endTime={event.endTime}
              timeZone="America/Los_Angeles"
            ></add-to-calendar-button>
            <RSVPForm eventTitle={event.title} eventId={event._id} />
          </div>
        </div>
      </div>
      <EventDetailMid
        description={event.description}
        eventDate={new Date(event.startDate)
          .toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .replace(/(\d+)(?=\b)/, function (day) {
            let j = day % 10,
              k = day % 100;
            if (j === 1 && k !== 11) return day + "st";
            if (j === 2 && k !== 12) return day + "nd";
            if (j === 3 && k !== 13) return day + "rd";
            return day + "th";
          })}
        eventTime={new Date(
          event.startDate + " " + event.startTime
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
        weekdayHours={"9 AM - 5 PM"}
        sundayHours={"9 AM - 12 PM"}
        organizerEmail={event.organizerEmail}
        registrationFee={event.registrationFee}
        venue={event.venue}
      />
      <span className={"event-details-suggestions-heading"}>
        Events you may like
      </span>
      <EventCatalog />
    </div>
  );
}

export default EventDetail;
