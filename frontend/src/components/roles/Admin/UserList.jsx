import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

import Popup from "../../Popup";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";

export default function UserList() {
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState({});
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);

  const Role = [
    "Admin",
    "Author",
    "General Editor",
    "Editor",
    "Reviewer",
    "Normal User"
  ];

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
  }, []);

  function roleMapping(role) {
    function userFunction(user) {
      function userDelete() {
        swal({
          title: "Are you sure?",
          text: `Once deleted, you will not be able to recover the user ${user.email}`,
          icon: "warning",
          buttons: true,
          dangerMode: true
        }).then((willDelete) => {
          if (willDelete) {
            swal("User " + user.email + " has been deleted!", {
              icon: "success"
            }).then(() => {
              axios.post("http://localhost:6969/userDelete", {
                id: user.id
              });
              window.location.reload();
            });
          }
        });
      }

      let temp = [];

      Role.map((each, index) => {
        if (each === user.role) {
          temp.push(
            <tr key={user.id}>
              <td className="dcolFirst"></td>
              <td>{user.fname}</td>
              <td>
              {user.lname}
              </td>
              <td>{user.email}</td>
              <td className="dcolbut">
                <button
                  onClick={() => {
                    setView(true);
                    setUser(user);
                  }}
                >
                  {" "}
                  <i className="fa-solid fa-eye"></i> View
                </button>
              </td>
              <td className="dcolbut">
                <button
                  onClick={() => {
                    setEdit(true);
                    setUser(user);
                  }}
                >
                  {" "}
                  <i className="fa-solid fa-pen-to-square"></i> Edit
                </button>
              </td>
              <td className="dcolbut">
                <button onClick={userDelete}>
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </td>
              <td className="dcolLast"></td>
            </tr>
          );
        } else {
          temp.push(null);
        }
      });

      return temp[Role.indexOf(role)];
    }

    return (
      <table key={role} className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan="8" className="hcol1">
              {role}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="dcolFirst"></td>
            <td>
              <strong>First Name</strong>
            </td>
            <td>
              <strong>Last Name</strong>
            </td>
            <td>
              <strong>Email</strong>
            </td>
            <td className="dcolbut"></td>
            <td className="dcolbut"></td>
            <td className="dcolbut"></td>
            <td className="dcolLast"></td>
          </tr>
          {userData.map(userFunction)}
        </tbody>
      </table>
    );
  }

  return (
    <div className="userList">
      <button
        onClick={() => {
          window.location.href = "/register";
        }}
        className="addUser"
      >
        <i className="fa-solid fa-circle-plus" />
        Add New User
      </button>
      {Role.map(roleMapping)}

      <Popup
        class="viewUser"
        innerClass="viewUser-inner"
        trigger={view}
        setTrigger={setView}
      >
        <ViewUser user={user} />
      </Popup>
      <Popup
        class="viewUser"
        innerClass="viewUser-inner"
        trigger={edit}
        setTrigger={setEdit}
      >
        <EditUser user={user} />
      </Popup>
    </div>
  );
}
