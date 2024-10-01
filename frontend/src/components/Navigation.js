import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Navigation() {
  const { isSignedIn } = useUser();

  return (
    <nav>
      <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-around' }}>
        <li><NavLink to="/" end>Home</NavLink></li>
        <SignedIn>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><UserButton /></li>
        </SignedIn>
        <SignedOut>
          <li><NavLink to="/sign-in">Sign In</NavLink></li>
          <li><NavLink to="/sign-up">Sign Up</NavLink></li>
        </SignedOut>
      </ul>
    </nav>
  );
}

export default Navigation;