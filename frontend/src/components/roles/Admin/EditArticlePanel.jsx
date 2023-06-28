import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import NotFound from "../../NotFound";

function EditArticlePanel(props) {
  const [article] = useState(props.article);
  const [type] = useState(props.type);

  const [fieldData, setFieldData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [field, setField] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [dateline, setDateline] = useState();
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState("");

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
        swal(`Article updated successfully!`, {
          icon: "success"
        }).then(() => {
          switch (type) {
            case "status":
              axios.patch("http://localhost:6969/editArticle", {
                type: type,
                articleID: article._id,
                status: status,
                field: article.field,
                category: article.category
              });
              console.log(status);
              break;
            case "title":
              axios.patch("http://localhost:6969/editArticle", {
                type: type,
                articleID: article._id,
                title: title,
                field: article.field,
                category: article.category
              });
              console.log(title);
              break;
            case "year":
              axios.patch("http://localhost:6969/editArticle", {
                type: type,
                articleID: article._id,
                year: year,
                field: article.field,
                category: article.category
              });
              console.log(year);
              break;
            case "dateline":
              axios.patch("http://localhost:6969/editArticle", {
                type: type,
                articleID: article._id,
                dateline: dateline,
                field: article.field,
                category: article.category
              });
              console.log(dateline);
              break;
            case "field":
            case "category":
              axios.patch("http://localhost:6969/editArticle", {
                type: type,
                articleID: article._id,
                dateline: dateline,
                field: article.field,
                category: article.category,
                newField: field,
                newCategory: category
              });
              console.log(field);
              console.log(category);
              break;
            default:
              console.log("Hello World!");
          }
          window.location.reload();
        });
      }
    });
  }
  function handleChange(event) {
    switch (event.target.name) {
      case "status":
        setStatus(event.target.value);
        break;
      case "title":
        setTitle(event.target.value);
        break;
      case "year":
        setYear(event.target.value);
        break;
      case "dateline":
        setDateline(event.target.value);
        break;
      case "field":
        setField(event.target.value);
        break;
      case "category":
        setCategory(event.target.value);
        break;
      default:
        console.log("Hello World!");
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
    case "status":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <div className="form-group">
              <label>
                <strong>Current Status: {article.status}</strong>
              </label>
              <br />
              <br />
              <select
                onChange={handleChange}
                className="form-select"
                name="status"
                id="status"
              >
                <option value="">New Status</option>
                <option value="Waiting">Waiting</option>
                <option value="Editing">Editing</option>
                <option value="Reviewing"> Reviewing</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Published">Published</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    case "title":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label>
              <strong>Current Title: {article.title}</strong>
            </label>
            <br />
            <br />
            <div className="left form-group">
              <label>
                <strong>New Title: </strong>
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={title}
                autoComplete="off"
                name="title"
                className="form-control"
                placeholder="New Title"
                required
              />
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    case "year":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label>
              <strong>Current Year: {article.year}</strong>
            </label>
            <br />
            <br />
            <div className="left form-group">
              <label>New Year: </label>
              <input
                className="form-control"
                type="number"
                autoComplete="off"
                name="year"
                value={year}
                min="0"
                onChange={handleChange}
                placeholder="Insert New Year"
              />
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
              <strong>Current Field: {article.field}</strong>
            </label>
            <br />
            <br />
            <label>
              <strong>Current Category: {article.category}</strong>
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
    case "dateline":
      return (
        <div>
          <form onSubmit={handleSubmit} method="post">
            <label>
              <strong>
                Current Dateline: {article.dateline.substring(8, 10)}-
                {article.dateline.substring(5, 7)}-
                {article.dateline.substring(0, 4)}
              </strong>
            </label>
            <br />
            <br />
            <div className="left form-group">
              <label>
                <strong>Status: </strong>
              </label>
              <input
                className="form-select"
                onChange={handleChange}
                type="date"
                name="dateline"
                value={dateline}
              />
            </div>
            <br />
            <button className="save">Save Changes</button>
          </form>
        </div>
      );
    default:
      return (
        <div>
          <NotFound />
        </div>
      );
  }
}

export default EditArticlePanel;