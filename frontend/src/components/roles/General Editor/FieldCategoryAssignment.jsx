import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";

function FieldCategoryAssignment(props) {
  const [fieldData, setFieldData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [user, setUser] = useState(props.user);

  const [field, setField] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:6969/fieldRead").then((res) => {
      setFieldData(res.data);
    });
    axios.get("http://localhost:6969/categoryRead").then((res) => {
      setCategoryData(res.data);
    });
  }, []);

  function handleChange(event) {
    if (event.target.name === "field") {
      setField(event.target.value);
    } else if (event.target.name === "category") {
      setCategory(event.target.value);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    swal({
      title: "Are you sure?",
      text: `Assign ${field}(Field) and ${category}(Category) to ${user.fname} ${user.lname}?`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then((will) => {
      if (will) {
        swal(`Changes saved successfully!`, {
          icon: "success"
        }).then(() => {
          axios
            .post("http://localhost:6969/fieldCatEditor", {
              email: user.email,
              field: field,
              category: category
            })
            window.location.href= "/manageeditors";
        });
      }
    });
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

  return (
    <div className="fieldCatAssignment">
      <table className="tableFull">
        <tbody>
          <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;Full Name:</td>
            <td>
              {user.fname} {user.lname}
            </td>
          </tr>
          <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;Email:</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;Current Field:</td>
            <td>{user.field}</td>
          </tr>
          <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;Current Category:</td>
            <td>{user.category}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <form onSubmit={handleSubmit} method="post">
        <div className="left form-group">
          <label>Field</label>

          <select className="form-select" name="field" onChange={handleChange}>
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
        <button>Save Changes</button>
      </form>
    </div>
  );
}

export default FieldCategoryAssignment;