import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";

function AssignEditor(props) {
  const [userData, setUserData] = useState([]);
  const [article, setArticle] = useState(props.article);
  const [editor, setEditor] = useState("");

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
  }, []);

  function handleChange(event) {
    if (event.target.name === "editor") {
      setEditor(event.target.value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    swal({
      title: "Are you sure?",
      text: `Assign this article to this editor?`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        swal(`${article.title} is assigned to the respective editor.`, {
          icon: "success"
        }).then(() => {
          axios.post("http://localhost:6969/assignEditor", {
            articleID: article._id,
            category: article.category,
            field: article.field,
            email: editor
          });
          window.location.reload();
        });
      }
    });
  }

  function userMapping(user) {
    if (user.role === "Editor") {
      if (user.field === article.field) {
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
        <select
          className="form-select"
          name="editor"
          id="editor"
          onChange={handleChange}
        >
          <option value="">Assign An Editor</option>
          {userData.map(userMapping)}
        </select>
        <button>Assign Article</button>
      </form>
    </div>
  );
}

export default AssignEditor;