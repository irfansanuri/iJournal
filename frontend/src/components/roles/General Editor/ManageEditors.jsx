import axios from "axios";
import React, { useEffect, useState } from "react";
import Popup from "../../Popup";
import FieldCategoryAssignment from "./FieldCategoryAssignment";

function ManageEditors() {
  const [userData, setUserData] = useState([]);
  const [user, setUser] = useState();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    }, []);
  });

  function userMapping(user) {
    if (user.role === "Editor") {
      return (
        <tr key={user.id}>
          <td>
            {user.fname} {user.lname}
          </td>
          <td>{user.email}</td>
          <td>
            {user.field}
            <button
              onClick={() => {
                setUser(user);
                setTrigger(true);
              }}
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </td>
          <td>
            {user.category}
            <button
              onClick={() => {
                setUser(user);
                setTrigger(true);
              }}
            >
              <i className="fa-solid fa-pencil"></i>
            </button>
          </td>
        </tr>
      );
    }
  }
  return (
    <div className="manageEditors">
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan={10}>Editor List</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <strong>Full Name</strong>
            </td>
            <td>
              <strong>Email</strong>
            </td>
            <td>
              <strong>Field</strong>
            </td>
            <td>
              <strong>Category</strong>
            </td>
          </tr>
          {userData.map(userMapping)}
        </tbody>
      </table>
      <Popup
        class="manageEditorPopup"
        innerClass="manageEditorPopup-inner"
        trigger={trigger}
        setTrigger={setTrigger}
      >
        <FieldCategoryAssignment user={user}/>
      </Popup>
    </div>
  );
}

export default ManageEditors;