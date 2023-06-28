import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

function EditUserPanel(props) {
  const [type] = useState(props.type);
  const [user] = useState(props.user);

  const [fieldData, setFieldData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [role, setRole] = useState();
  const [field, setField] = useState("");
  const [category, setCategory] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  useEffect(() => {
    axios.get("http://localhost:6969/fieldRead").then((res) => {
      setFieldData(res.data);
    });
    axios.get("http://localhost:6969/categoryRead").then((res) => {
      setCategoryData(res.data);
    });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    swal({
      title: "Are you sure?",
      text: `Changes cannot be undo`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then((willDelete) => {
      if (willDelete) {
        swal(`User updated successfully!`, {
          icon: "success"
        }).then(() => {
          switch (type) {
            case "role":
              axios.patch("http://localhost:6969/editUser", {
                type: type,
                email: user.email,
                role: role
              });
              break;
            case "field":
            case "category":
              axios.patch("http://localhost:6969/editUser", {
                type: type,
                email: user.email,
                field: field,
                category: category
              });
              break;
            case "fullName":
              axios.patch("http://localhost:6969/editUser", {
                type: type,
                email: user.email,
                fname: fname,
                lname: lname
              });
              break;
            default:
              console.log("Hello World");
          }
          window.location.reload();
        });
      }
    });
  }
  function handleChange(event) {
    if (event.target.name === "role") {
      setRole(event.target.value);
    } else if (event.target.name === "fname") {
      setFname(event.target.value);
    } else if (event.target.name === "lname") {
      setLname(event.target.value);
    } else if (event.target.name === "field") {
      setField(event.target.value);
    } else if (event.target.name === "category") {
      setCategory(event.target.value);
    }
  }

  function fieldMap(field) {
    return (
      <option key={field._id} value={field.name}>
        {field.name}
      </option>
    );
  }

  function categoryMap(category) {
    if (category.field === field) {
      return (
        <option key={category._id} value={category.name}>
          {category.name}
        </option>
      );
    } else {
      return null;
    }
  }

  switch (type) {
    case "fullName":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label>
              <strong>
                Current Value: {user.fname} {user.lname}
              </strong>
            </label>
            <br />
            <br />
            <div className="left form-group">
              <label>
                <strong>New First Name: </strong>
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={fname}
                autoComplete="off"
                name="fname"
                className="form-control"
                placeholder="First Name"
                required
              />
            </div>
            <div className="left form-group">
              <label>
                <strong>New Last Name: </strong>
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={lname}
                autoComplete="off"
                name="lname"
                className="form-control"
                placeholder="New Last Name"
                required
              />
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    case "role":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <div className="form-group">
              <label>
                <strong>Current Role: {user.role}</strong>
              </label>
              <br />
              <br />
              <label>
                <strong>New Role: </strong>
              </label>
              <select
                onChange={handleChange}
                className="form-select"
                name="role"
                id="role"
              >
                <option value="">Choose A Role</option>
                <option value="Admin">Admin</option>
                <option value="Author">Author</option>
                <option value="General Editor"> General Editor</option>
                <option value="Editor">Editor</option>
                <option value="Reviewer">Reviewer</option>
                <option value="User">Normal User</option>
              </select>
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    case "field":
    case "category":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label>
              <strong>Current Field: {user.field}</strong>
            </label>
            <br />
            <br />
            <label>
              <strong>Current Category: {user.category}</strong>
            </label>
            <br />
            <br />
            <br />
            <div className="left form-group">
              <label>Field</label>

              <select
                className="form-select"
                name="field"
                onChange={handleChange}
              >
                <option value="">Choose A Field</option>
                {fieldData.map(fieldMap)}
              </select>
            </div>
            <div className="left form-group">
              <label>Category</label>
              <select
                className="form-select"
                name="category"
                onChange={handleChange}
              >
                <option value="">Choose A Category</option>
                {categoryData.map(categoryMap)}
              </select>
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    default:
      return <div></div>;
  }
}

export default EditUserPanel;