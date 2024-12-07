import React, { useState } from 'react';
import '../styles/body.css';
import EventCatalog from './EventCatalog';
import EventsFilter from "./EventFilters";
import Recommendations from "./Recommendations";

function Body(props) {
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="body-container">
            {/* Text and Image Section */}
            <div className="text-image-section">
                <div className="left-text">
                    <h1>Welcome to <span className={"text-bg-primary"}>Hokie Event Sphere</span></h1>
                    <p>Discover and attend events that matter to you. Your hub for event planning, registration, and more!</p>
                    <button className={"btn btn-primary home-hero-button"}>2k+ total events hosted</button>
                    <button className={"btn btn-primary home-hero-button"}>100+ live events</button>
                </div>
                <div className="right-image">
                    <img src={require("../Images/homeHero.png")} alt="Event" width={1200} />
                </div>
            </div>
            {props.isSignedIn && <Recommendations /> }
            <EventsFilter onCategoryChange={handleCategoryChange} />
            <EventCatalog selectedCategory={selectedCategory} />
        </div>
    );
}

export default Body;
