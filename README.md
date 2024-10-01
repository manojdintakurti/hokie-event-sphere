# Hokie Event Sphere

**Hokie Event Sphere** is a centralized platform designed to streamline event management and discovery for university students. The platform addresses the challenge of fragmented communication across emails, Google Forms, and departmental announcements by providing a unified system for event creation, discovery, and management.

## Features

- **AI-Powered Event Recommendations**: Utilizing a Large Language Model (LLM) and clickstream data, the system offers personalized event suggestions based on user preferences and interactions.
- **Event Creation and Management**: Students can easily create, join, and manage campus events, eliminating the need for disjointed communication.
- **RSVP Integration**: Integrated RSVP system allows users to register for events and provides event organizers with insights on attendance.
- **Real-Time Notifications**: Get notified of event updates and reminders via push notifications and calendar integrations (e.g., Google Calendar).
- **Social Media Promotion**: Event organizers can promote their events on social media platforms like Facebook and Twitter to increase visibility.
- **Venue Navigation**: Find event locations easily with map-based navigation integrated using Google Maps API.

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB (Development and Production)
- **Frontend**: React, HTML5, CSS3, Bootstrap
- **AI/ML**: LLM-powered recommendation system, RAG-based chatbot
- **Cloud Infrastructure**: AWS for deployment and scalability
- **Other Tools**: Clerk for secure authentication, Google Maps API for navigation

## Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://code.vt.edu/saimanoj/hokie-event-sphere.git
    cd hokie-event-sphere
    ```

2. Set up the backend:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the backend directory with the following content:
    ```
    MONGODB_URI=your_mongodb_connection_string
    CLERK_SECRET_KEY=your_clerk_secret_key
    PORT=5000
    ```

3. Set up the frontend:
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the frontend directory with the following content:
    ```
    REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    REACT_APP_BACKEND_URL=http://localhost:5000
    ```

4. Run the backend:
    ```bash
    cd ../backend
    npm run dev
    ```
    The backend server will start on http://localhost:5000

5. In a new terminal, run the frontend:
    ```bash
    cd ../frontend
    npm start
    ```
    The frontend development server will start on http://localhost:3000

6. Open your browser and navigate to http://localhost:3000 to use the application.

## Usage

- Create an account or log in using the authentication system.
- Explore events on the homepage or create your own event.
- RSVP to events you're interested in attending.
- Use the profile page to manage your events and preferences.

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

## Troubleshooting

If you encounter any issues while setting up or running the application, please check the following:

- Ensure all dependencies are correctly installed.
- Verify that MongoDB is running and accessible.
- Check that all environment variables are correctly set.
- For any persistent issues, please open an issue in the project repository.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.