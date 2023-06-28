import React from "react";

function HeaderBefore() {
  return (
    <div className="header">
      <div className="rainbow"></div>
      <div className="upperheader">
        <div className="headericon">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </div>
      <div className="mainheader">
        <img src="images/logo.png" alt="logo" width="300" height=" 75" />
      </div>

      <div className="navbar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/browse">Browse</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeaderBefore;