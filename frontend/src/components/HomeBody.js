import React from 'react';
import '../styles/body.css';
import EventCatalog from './EventCatalog';

function Body() {
    return (
        <div className="body-container">
            {/* Text and Image Section */}
            <div className="text-image-section">
                <div className="left-text">
                    <h1>Welcome to <span className={"text-bg-primary"}>Hokie Event Sphere</span></h1>
                    <p>Discover and attend events that matter to you. Your hub for event planning, registration, and more!</p>
                </div>
                <div className="right-image">
                    <img src={require("../Images/homeHero.png")} alt="Event Image" />
                </div>
            </div>

            {/* Catalog Section */}
            <EventCatalog />
        </div>
    );
}

export default Body;
