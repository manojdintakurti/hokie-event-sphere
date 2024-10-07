import React from 'react';
import '../styles/EventFilters.css';

function EventsFilter() {
    return (
        <div className="events-filter-container">
            <div className="left-text">
                <h1>Events around you</h1>
            </div>

            <div className="right-filters">
                <select className="filter-dropdown">
                    <option>Weekdays</option>
                    <option>Weekend</option>
                    <option>Any day</option>
                </select>

                <select className="filter-dropdown">
                    <option>Event type</option>
                    <option>Workshop</option>
                    <option>Conference</option>
                    <option>Meetup</option>
                </select>

                <select className="filter-dropdown">
                    <option>Any category</option>
                    <option>Technology</option>
                    <option>Education</option>
                    <option>Music</option>
                </select>
            </div>
        </div>
    );
}

export default EventsFilter;
