import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";

function AssignReviewer(props) {
  const [userData, setUserData] = useState([]);
  const [article] = useState(props.article);
  const [dateline, setDateline] = useState();

  const [reviewer1, setReviewer1] = useState("");
  const [reviewer2, setReviewer2] = useState("");
  const [reviewer3, setReviewer3] = useState("");

  const [r3Trigger, setR3Trigger] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
  }, []);

  function handleChange(event) {
    if (event.target.name === "dateline") {
      setDateline(event.target.value);
    } else if (event.target.name === "reviewer1") {
      setReviewer1(event.target.value);
    } else if (event.target.name === "reviewer2") {
      setReviewer2(event.target.value);
    } else if (event.target.name === "reviewer3") {
      setReviewer3(event.target.value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (reviewer1 === "" || reviewer2 === "") {
      swal({
        text: `First and Second Reviewer cannot be empty!`,
        icon: "error",
        dangerMode: true
      });
    } else {
      swal({
        title: "Are you sure?",
        text: `Assign this article to these reviewers?`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          swal(`${article.title} is assigned to the respective reviewers.`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/assignReviewer", {
              articleID: article._id,
              category: article.category,
              field: article.field,
              reviewer1: reviewer1,
              reviewer2: reviewer2,
              reviewer3: reviewer3,
              dateline: dateline
            });
            window.location.reload();
          });
        }
      });
    }
  }

  function userMapping(user) {
    if (user.role === "Reviewer") {
      return (
        <option key={user.id} value={user.email}>
          {user.fname} {user.lname}
        </option>
      );
    }
  }

  function userMapping2(user) {
    if (reviewer1 === "") {
    } else if (user.role === "Reviewer") {
      if (user.email !== reviewer1) {
        return (
          <option key={user.id} value={user.email}>
            {user.fname} {user.lname}
          </option>
        );
      }
    }
  }

  function userMapping3(user) {
    if (reviewer1 === "" || reviewer2 === "") {
    } else if (user.role === "Reviewer") {
      if (user.email !== reviewer1 && user.email !== reviewer2) {
        return (
          <option key={user.id} value={user.email}>
            {user.fname} {user.lname}
          </option>
        );
      }
    }
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>
              <strong>Title:</strong>
            </th>
          </tr>
          <tr>
            <td>{article.title}</td>
          </tr>
          <tr />
          <tr />
          <tr>
            <th>
              <strong>Field:</strong>
            </th>
          </tr>
          <tr>
            <td>{article.field}</td>
          </tr>
          <tr />
          <tr />
          <tr>
            <th>
              <strong>Category:</strong>
            </th>
          </tr>
          <tr>
            <td>{article.category}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="dateline">Dateline:</label>
        <input
          className="form-select"
          onChange={handleChange}
          type="date"
          name="dateline"
          value={dateline}
        />
        <br />
        <select
          className="form-select"
          name="reviewer1"
          onChange={handleChange}
        >
          <option value="">Assign First Reviewer</option>
          {userData.map(userMapping)}
        </select>
        <br />
        <select
          className="form-select"
          name="reviewer2"
          onChange={handleChange}
        >
          <option value="">Assign Second Reviewer</option>
          {userData.map(userMapping2)}
        </select>
        {r3Trigger ? (
          <div>
            <br />
            <select
              className="form-select"
              name="reviewer3"
              onChange={handleChange}
            >
              <option value="">Assign Third Reviewer</option>
              {userData.map(userMapping3)}
            </select>
            <a
              href="#"
              onClick={() => {
                setReviewer3("");
                setR3Trigger(false);
              }}
            >
              Remove
            </a>
          </div>
        ) : (
          <a
            href="#"
            onClick={() => {
              setR3Trigger(true);
            }}
          >
            Add another reviewer?
          </a>
        )}
        <br />
        <button>Assign Article</button>
      </form>
    </div>
  );
}

export default AssignReviewer;