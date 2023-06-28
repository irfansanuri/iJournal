import React, { useState } from "react";

function ViewUser(props) {
  const [user, setUser] = useState(props.user);

  function dateFormat(date){
    let year = date.substring(0,4);
    let monthNum = date.substring(5,7);
    let day = date.substring(8,10);
    let month = String;

    switch(monthNum){
      case "01":
        month = "January"
        break;

      case "02":
        month = "February"
        break;

      case "03":
        month = "March"
        break;

      case "04":
        month = "April"
        break;

      case "05":
        month = "May"
        break;

      case "06":
        month = "June"
        break;

      case "07":
        month = "July"
        break;

      case "08":
        month = "August"
        break;

      case "09":
        month = "September"
        break;

      case "10":
        month = "October"
        break;

      case "11":
        month = "November"
        break;

      case "12":
        month = "December"
        break;

    }

    return (day + " " + month + " " + year)

  }

  return (
    <div>
      <img
        src="images/avatar.png"
        alt="profile"
        width="170px"
        height="170px"
      />
      <br/>
      <br/>
      <table className="profileDetails">
        <tbody>
          <tr>
            <td className="first">User ID</td>
            <td className="second">{user.id}</td>
          </tr>
          <tr>
            <td className="first">Full Name</td>
            <td className="second">
              {user.fname} {user.lname}
            </td>
          </tr>
          <tr>
            <td className="first">Email Address</td>
            <td className="second">{user.email}</td>
          </tr>
          <tr>
            <td className="first">Role</td>
            <td className="second">{user.role}</td>
          </tr>
          <tr>
            <td className="first">Field</td>
            <td className="second">{user.field}</td>
          </tr>
          <tr>
            <td className="first">Category</td>
            <td className="second">{user.category}</td>
          </tr>
          <tr>
            <td className="first">Registered Since</td>
            <td className="second">{dateFormat(user.date)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ViewUser;
