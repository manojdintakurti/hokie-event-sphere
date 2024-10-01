import React from 'react';
import { SignUp } from '@clerk/clerk-react';

function SignUpPage() {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}

export default SignUpPage;