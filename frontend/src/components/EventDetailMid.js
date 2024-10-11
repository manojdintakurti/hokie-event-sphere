import {FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaWhatsapp} from "react-icons/fa";
import React from "react";
import "../styles/EventDetail.css";

function EventDetailMid(){
    return (
        <div className="additional-details">
            {/* Left side: Event description, hours, organizers, and fees */}
            <div className="event-left-section">
                <h4>Description</h4>
                <p>
                    DesignHub organized a 3D Modeling Workshop using Blender on 16th February at 5 PM. The workshop
                    taught participants the magic of creating stunning 3D models and animations using Blender. It was
                    suitable for both beginners and experienced users. The event was followed by a blender-render
                    competition, which added to the excitement.
                </p>
                <h4>Hours</h4>
                <p>Weekdays hour: <span className="highlight">7PM - 10PM</span></p>
                <p>Sunday hour: <span className="highlight">7PM - 10PM</span></p>

                <h4>Organizer Contact</h4>
                <p>Please go to <a href="https://www.sneakypeeks.com" target="_blank"
                                   rel="noopener noreferrer">www.sneakypeeks.com</a> and refer the FAQ section for more detail.</p>
                <h4>Registration Fee</h4>
                <p>$10</p>
            </div>

            {/* Right side: Map location and social media sharing */}
            <div className="event-right-section">
                <h4>Location</h4>
                <div className="map-container">
                    {/* Embed map */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2359998725895!2d-122.08424968469478!3d37.42206537982547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb5e56dadd5a1%3A0x9456c9c3e2fa7b0e!2sGoogleplex!5e0!3m2!1sen!2sus!4v1632072361374!5m2!1sen!2sus"
                        width="100%"
                        height="200"
                        style={{border: 0}}
                        allowFullScreen=""
                        loading="lazy"
                        title="Event Location"
                    ></iframe>
                </div>

                <h4>Share with Friends</h4>
                <div className="social-media-icons">
                    <FaFacebook className="icon"/>
                    <FaTwitter className="icon"/>
                    <FaInstagram className="icon"/>
                    <FaLinkedin className="icon"/>
                    <FaWhatsapp className="icon"/>
                </div>
            </div>
        </div>
    );
}

export default EventDetailMid;