import React from "react";
import {useUser} from "@clerk/clerk-react";
import "../styles/Home.css"
import Header from "./Header";
import Body from "./HomeBody";



function HomeSignedIn() {
    const {isSignedIn, user} = useUser();
    return (
        <div className="home-page">
            <Body/>
            {/*<Footer/>*/}
        </div>

    );
}

export default HomeSignedIn;
