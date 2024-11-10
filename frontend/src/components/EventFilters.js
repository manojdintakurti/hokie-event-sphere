import React from 'react';
import '../styles/EventFilters.css';

function EventsFilter({ onCategoryChange }) {
    const handleCategoryChange = (event) => {
        onCategoryChange(event.target.value);
    };

    return (
        <div className="events-filter-container">
            <div className="left-text">
                <h1>Events around you</h1>
            </div>

            <div className="right-filters">
                <select className="filter-dropdown" onChange={handleCategoryChange}>
                    <option value="">Any category</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                    <option value="Educational">Educational</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Travel">Travel</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Social">Social</option>
                </select>
            </div>
        </div>
    );
}

export default EventsFilter;
