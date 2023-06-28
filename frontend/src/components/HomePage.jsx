import React from "react";
import useAuth from "../hooks/useAuth";

function HomePage(props) {

  const [user] = useAuth();

  return (
    (user.accesstoken) 
      ? <div><h1>You are Logged In</h1></div>
      : <div><h1>HOMEPAGE</h1></div>
  );
}

export default HomePage;