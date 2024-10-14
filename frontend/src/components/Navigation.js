import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import '../styles/global.css';

// import this 

function Navigation() {
  const { isSignedIn } = useUser();

  return (
    <nav style={{ 
      backgroundColor: '#34495e', 
      padding: '10px 0',
      marginTop:'30px'
    }}>
      <ul style={{ 
        listStyle: 'none', 
        display: 'flex', 
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0'
      }}>
        <li><NavLink to="/" end style={navLinkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>Home</NavLink></li>
        <SignedIn>
          <li><NavLink to="/profile" style={navLinkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>Profile</NavLink></li>
          <li><UserButton userProfileMode="navigation" userProfileUrl="/profile" /></li>
        </SignedIn>
        <SignedOut>
          <li><NavLink to="/sign-in" style={navLinkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>Sign In</NavLink></li>
          <li><NavLink to="/sign-up" style={navLinkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>Sign Up</NavLink></li>
        </SignedOut>
      </ul>
    </nav>
  );
}

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  transition: 'background-color 0.3s'
};

export default Navigation;