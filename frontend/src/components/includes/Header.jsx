import React from "react";
import useAuth from "../../hooks/useAuth";

import HeaderAfter from "./Header/HeaderAfter";
import HeaderBefore from "./Header/HeaderBefore";

function Header(props) {

  const [user] = useAuth();

  return (
    (user.accesstoken) 
      ? <HeaderAfter logOut={props.logOut}/> 
      : <HeaderBefore/>
  );
}

export default Header;