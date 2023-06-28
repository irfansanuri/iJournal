import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import Cookies from "js-cookie";

function UploadArticle() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [field, setField] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState();
  const [pathArticle, setPathArticle] = useState();

  const [categoryData, setCategoryData] = useState([]);
  const [fieldData, setFieldData] = useState([]);

  let email = Cookies.get('email');

  useEffect(() => {
    axios.get("http://localhost:6969/categoryRead").then((res) => {
      setCategoryData(res.data);
    });

    axios.get("http://localhost:6969/fieldRead").then((res) => {
      setFieldData(res.data);
    });

  }, []);

  function handleChange(e) {
    if (e.target.name === "file") {
      setPathArticle(e.target.files[0]);
    } else if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "author") {
      setAuthor(e.target.value);
    } else if (e.target.name === "field") {
      setField(e.target.value);
    } else if (e.target.name === "category") {
      setCategory(e.target.value);
    } else if (e.target.name === "year") {
      setYear(e.target.value);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    formData.append("pathArticle", pathArticle);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("field", field);
    formData.append("category", category);
    formData.append("year", year);
    
    formData.append("email", email);

    swal({
      title: "Are you sure?",
      text: `Do you want this article to be review?`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then((will) => {
      if (will) {
        swal(`Your article has been added and waited to be review.!`, {
          icon: "success"
        }).then(() => {
          axios.post("http://localhost:6969/createArticle", formData).then(()=>{
            window.location.href="/underreview"
          });
        });
      }

      setTitle("");
      setAuthor("");
      setCategory("");
      setField("");
      setYear("");
      setPathArticle("");
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
    <div className="createArticle form-control">
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <h3>Add New Article</h3>
        <div className="left form-group">
          <label>Article Title</label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Article Title"
            required
          />
        </div>
        <div className="left form-group">
          <label>Author Name</label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            name="author"
            value={author}
            onChange={handleChange}
            placeholder="Author Name"
            required
          />
        </div>
        <div className="left form-group">
          <label>Field</label>

          <select className="form-select" name="field" onChange={handleChange} required>
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
            required
          >
            <option value="">Choose A Category</option>
            {categoryData.map(categoryMap)}
          </select>
        </div>

        <div className="left form-group">
          <label>Year</label>
          <input
            className="form-control"
            type="number"
            autoComplete="off"
            name="year"
            value={year}
            min="0"
            onChange={handleChange}
            placeholder="Year Published"
            required
          />
        </div>

        <div className="left form-group">
          <label>Choose an article to upload (.pdf)</label>
          <br />
          <input type="file" name="file" onChange={handleChange} />
        </div>

        <button className="btn btn-primary" type="submit">
          Add Article
        </button>
      </form>
    </div>
  );
}

export default UploadArticle;
