import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import CreateEvent from './components/CreateEvent';
import './styles/global.css';
import Header from "./components/Header";
import Footer from "./components/footer";
import EventDetail from "./components/EventDetail";
import Recommendations from "./components/Recommendations";
import './index.css';


const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          <Route 
            path="/profile" 
            element={
              <>
                <SignedIn>
                  <UserProfile />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            } 
          />
          <Route 
            path="/create-event" 
            element={
              <>
                <SignedIn>
                  <CreateEvent />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            } 
          />
          <Route path="/event-detail/:eventId" element={<EventDetail />} />
          <Route path="/Recommendations" element={<Recommendations />} />

        </Routes>
        <Footer />
      </Router>
    </ClerkProvider>
  );
}

export default App;