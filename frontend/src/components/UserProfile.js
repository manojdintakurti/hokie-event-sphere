import React from 'react';
import { useUser } from '@clerk/clerk-react';

function UserProfile() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div>
      <h1>User Profile</h1>
      <img src={user.profileImageUrl} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%' }} />
      <p>Name: {user.fullName}</p>
      <p>Email: {user.primaryEmailAddress.emailAddress}</p>
      <p>User ID: {user.id}</p>
      {/* Add more user details as needed */}
    </div>
  );
}

export default UserProfile;