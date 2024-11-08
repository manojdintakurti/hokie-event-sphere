import React from 'react';
import { useUser } from '@clerk/clerk-react';
import '../styles/global.css';
import Body from "./HomeBody";
import ProfileDialog from "./ProfileDialoug";

function Home() {
  const { isSignedIn, user } = useUser();
  return (
    <div className="container">
        {isSignedIn && <ProfileDialog />}
      <Body />
    </div>
  );
}

export default Home;