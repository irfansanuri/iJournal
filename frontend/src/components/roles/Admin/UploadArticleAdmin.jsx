//BACKEND BELUM BUAT

import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

function UploadArticleAdmin() {
  const [title, setTitle] = useState("");

  const [author, setAuthor] = useState("");

  const [field, setField] = useState("");
  const [category, setCategory] = useState("");

  const [status, setStatus] = useState("");
  const [year, setYear] = useState();
  const [pathArticle, setPathArticle] = useState();

  const [categoryData, setCategoryData] = useState([]);
  const [fieldData, setFieldData] = useState([]);
  
  let statusData = [
    'Waiting', // Waiting to assign to editor
    'Editing', // Assessed by editor and edited
    'Reviewing', // Edited journal reviewed by reviewer
    'Reviewed', // Send back to editor for final assesment
    'Published', // If approved, publish the journal
  ]

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
    } else if(e.target.name === "status") {
      setStatus(e.target.value);
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
    formData.append("status", status);

    swal({
      title: "Are you sure?",
      text: `Do you want to create this article?`,
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then((will) => {
      if (will) {
        swal(`Your article has been created.!`, {
          icon: "success"
        }).then(() => {
          axios.post("http://localhost:6969/adminCreateArticle", formData).then(()=>{
            
          });
          window.location.href="/managearticles"
        });
      }


    });
  }

  function statusMap(status){
    return (
      <option key={statusData.indexOf(status)} value={status}>
        {status}
      </option>
    );
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
    <div className="createArticle createArticleAdmin form-control">
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
          />
        </div>

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

        {/* New */}
        <div className="left form-group">
          <label>Status</label>

          <select className="form-select" name="status" onChange={handleChange}>
            <option value="">Status</option>
            {statusData.map(statusMap)}
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

export default UploadArticleAdmin;