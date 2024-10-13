import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import Body from "./HomeBody";

function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="container">
      <Body />
    </div>
  );
}

export default Home;