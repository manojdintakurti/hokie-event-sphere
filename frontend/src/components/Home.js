import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import HomeSignedIn from "./HomeSignedIn";

function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="container">
      {isSignedIn ? (
        <HomeSignedIn />
      ) : (
        <div>
          <p>Connect with your community, discover exciting events, and make the most of your university experience!</p>
          <p>Sign in to get started or create an account if you're new here.</p>
          <Link to="/sign-in">
            <button>Sign In</button>
          </Link>
          <Link to="/sign-up">
            <button style={{ marginLeft: '10px', backgroundColor: '#2ecc71' }}>Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;