import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Popup from "../../Popup";
import EditUser from "../../roles/Admin/EditUser";

function HeaderAfter(props) {
  const user = {
    role: Cookies.get("role"),
    email: Cookies.get("email")
  };

  const [profile, setProfile] = useState({});
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    axios
      .post("http://localhost:6969/readSpecificUser", {
        email: user.email
      })
      .then((res) => {
        setProfile(res.data);
      });
  }, []);

  let options = [];
  let paths = [];

  if (user.role === "Admin") {
    options = ["Manage Users", "Manage Fields", "Manage Articles"];
    paths = ["/manageusers", "/managefields", "/managearticles"];
  } else if (user.role === "Author") {
    options = ["Publish New Article", "Articles Under Review"];
    paths = ["/publisharticle", "/underreview"];
  } else if (user.role === "General Editor") {
    options = ["Manage Fields", "Manage Editors", "Assign Articles"];
    paths = ["/managefields", "/manageeditors", "/assignarticles"];
  } else if (user.role === "Editor") {
    options = ["Manage Articles", "Articles Under Review"];
    paths = ["/managearticleseditor", "/underreview"];
  } else if (user.role === "Reviewer") {
    options = ["Manage Articles", "Articles Under Review"];
    paths = ["/managearticlesreview", "/underreview"];
  }

  function navDropdown(option) {
    return (
      <li key={options.indexOf(option)}>
        <a href={paths[options.indexOf(option)]}>{option}</a>
      </li>
    );
  }

  function manageProfile() {
    setTrigger(true);
  }

  return (
    <div className="header">
      <div className="rainbow"></div>
      <div className="upperheader">
        <div className="headericon">
          <a href="/" onClick={props.logOut}>
            Log Out
          </a>
        </div>
      </div>
      <div className="mainheader">
        <img src="images/logo.png" alt="logo" width="300" height=" 75" />
      </div>
      <a href="#" onClick={manageProfile}>
        <button className="manageProfile">Manage Profile</button>
      </a>
      <div className="navbar">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/browse">Browse</a>
          </li>
          <li className="panel">
            <a href="#">
              {user.role} Panel &nbsp;
              <i className="fas fa-caret-down"></i>
            </a>
            <ul>{options.map(navDropdown)}</ul>
          </li>
        </ul>
      </div>
      <Popup
        class="viewUser"
        innerClass="viewUser-inner"
        trigger={trigger}
        setTrigger={setTrigger}
      >
        <EditUser user={profile} />
      </Popup>
    </div>
  );
}

export default HeaderAfter;

