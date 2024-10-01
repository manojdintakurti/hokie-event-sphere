import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../styles/global.css';

function SignInPage() {
  return (
    <div className="container" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In to Hokie Event Sphere</h1>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}

export default SignInPage;