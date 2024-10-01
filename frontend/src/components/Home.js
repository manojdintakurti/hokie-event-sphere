import React from 'react';
import { useUser } from '@clerk/clerk-react';

function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <h1>Welcome to Hokie Event Sphere</h1>
      {isSignedIn ? (
        <p>Hello, {user.firstName}!</p>
      ) : (
        <p>Please sign in to access all features.</p>
      )}
    </div>
  );
}

export default Home;