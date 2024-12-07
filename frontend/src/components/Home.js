import React, {useEffect} from 'react';
import { useUser } from '@clerk/clerk-react';
import '../styles/global.css';
import Body from "./HomeBody";
import ProfileDialog from "./ProfileDialoug";

function Home() {
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    if (isSignedIn) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        const existingEmail = sessionStorage.getItem("userEmail");
        if (existingEmail) {
          sessionStorage.removeItem("userEmail");
        }
        sessionStorage.setItem("userEmail", email);
      }
    }
  }, [isSignedIn, user]);
  return (
    <div className="container">
        {isSignedIn && <ProfileDialog />}
      <Body isSignedIn = {isSignedIn}/>
    </div>
  );
}

export default Home;