import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import '../styles/global.css'; // Import the CSS
import "../styles/signIn.css"

function SignInPage() {
    return (
        <div className="sign-in-container">
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </div>
    );
}

export default SignInPage;
