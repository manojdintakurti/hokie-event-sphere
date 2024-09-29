
# Hokie Event Sphere

**Hokie Event Sphere** is a centralized platform designed to streamline event management and discovery for university students. The platform addresses the challenge of fragmented communication across emails, Google Forms, and departmental announcements by providing a unified system for event creation, discovery, and management.

## Features

- **AI-Powered Event Recommendations**: Utilizing a Large Language Model (LLM) and clickstream data, the system offers personalized event suggestions based on user preferences and interactions.
- **Event Creation and Management**: Students can easily create, join, and manage campus events, eliminating the need for disjointed communication.
- **RSVP Integration**: Integrated RSVP system allows users to register for events and provides event organizers with insights on attendance.
- **Real-Time Notifications**: Get notified of event updates and reminders via push notifications and calendar integrations (e.g., Google Calendar).
- **Social Media Promotion**: Event organizers can promote their events on social media platforms like Facebook and Twitter to increase visibility.
- **Venue Navigation**: Find event locations easily with map-based navigation integrated using Google Maps API.
- **AI Chatbot**: An AI-powered chatbot helps users with event-related queries in real-time, using retrieval-augmented generation (RAG) techniques.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB (Development and Production)
- **Frontend**: React, HTML5, CSS3, Bootstrap
- **AI/ML**: LLM-powered recommendation system, RAG-based chatbot
- **Cloud Infrastructure**: AWS for deployment and scalability
- **Other Tools**: OAuth for secure authentication, Google Maps API for navigation

## Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/hokie-event-sphere.git
    ```
2. Install dependencies:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
3. Configure the database connection and environment variables in `.env`.
4. Run the backend:
    ```bash
    cd backend
    npm start
    ```
5. Run the frontend:
    ```bash
    cd frontend
    npm start
    ```

## Future Enhancements

- **Event Analytics**: Provide event organizers with insights into event engagement and attendance patterns.
- **Enhanced AI Recommendations**: Further refine recommendations using additional data points such as past event attendance and user interests.
- **Mobile App**: Develop a mobile-first version for improved accessibility on-the-go.
- **Security Features**: Strengthen data security with advanced encryption methods and multi-factor authentication (MFA).

## Contributors

- **Sai Manoj Dintakurti**: Backend Developer
- **Visruta Saripella**: AWS Specialist
- **Prerna Sehrawat**: Product Manager
- **Shrihari Maheshwari**: Frontend Developer
- **Sai Manas Rao Pulakonti**: Machine Learning Specialist
