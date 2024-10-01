import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import '../styles/global.css';

function SignUpPage() {
  return (
    <div className="container" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Join Hokie Event Sphere</h1>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}

export default SignUpPage;