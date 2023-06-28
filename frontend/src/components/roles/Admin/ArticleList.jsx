import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import Cookies from "js-cookie";
import Popup from "../../Popup";
import ViewArticle from "../panels/ViewArticle";
import EditArticle from "./EditArticle";

function ArticleList() {
  const [articleData, setArticleData] = useState([]);
  const [viewTrigger, setViewTrigger] = useState(false);
  const [editTrigger, setEditTrigger] = useState(false);
  const [search, setSearch] = useState("");

  const [theArticle, setTheArticle] = useState();

  let email = Cookies.get("email");

  useEffect(() => {
    axios.get("http://localhost:6969/readArticle").then((res) => {
      setArticleData(res.data.articles);
    });
  }, []);

  function handleChange(e) {
    setSearch(e.target.value);
  }

  function articleMapping(article) {
    function deleteArticle() {
      console.log(article._id);
      console.log(article.category);
      console.log(article.field);

      swal({
        title: "Are you sure?",
        text: `Do you want to delete this article?`,
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then((will) => {
        if (will) {
          swal(`Your article has been deleted!`, {
            icon: "success"
          }).then(() => {
            axios.post("http://localhost:6969/deleteArticle", {
              articleID: article._id,
              category: article.category,
              field: article.field,
              email: email
            });
            window.location.reload();
          });
        }
      });
    }

    let lowTitle = article.title.toLowerCase();
    let lowSearch = search.toLowerCase();

    if (lowTitle.includes(lowSearch)) {
      return (
        <tr key={article._id}>
          <td colSpan="2">
            <a href={article.path} target="_blank">
              {article.title.substring(0, 50)}
            </a>{" "}
          </td>
          <td colSpan="1">{article.author}</td>
          <td colSpan="1">{article.year}</td>
          <td colSpan="1">{article.category}</td>
          <td
            colSpan="1"
            style={
              article.status === "Published"
                ? { fontWeight: "bold", color: "#32CD32" }
                : article.status === "Rejected"
                ? { fontWeight: "bold", color: "gray" }
                : article.status === "Editing"
                ? { fontWeight: "bold", color: "#00BFFF" }
                : article.status === "Reviewing"
                ? { fontWeight: "bold", color: "#DC143C" }
                : article.status === "Reviewed"
                ? { fontWeight: "bold", color: "#8B0000" }
                : { fontWeight: "bold", color: "#EFB700" }
            }
          >
            {article.status} &nbsp;
          </td>

          <td className="dcolbut" colSpan="1">
            <button
              onClick={() => {
                setTheArticle(article);
                setViewTrigger(true);
              }}
            >
              <i className="fa-solid fa-eye"></i>
              <br /> View
            </button>
          </td>
          <td className="dcolbut" colSpan="1">
            <button
              onClick={() => {
                setTheArticle(article);
                setEditTrigger(true);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <br /> Edit
            </button>
          </td>
          <td className="dcolbut" colSpan="1">
            <button onClick={deleteArticle}>
              <i className="fa-solid fa-trash"></i>
              <br /> Delete
            </button>
          </td>
        </tr>
      );
    }
  }

  return (
    <div className="articleList">
      <button
        onClick={() => {
          window.location.href = "/adminpublisharticle";
        }}
        className="addArticle"
      >
        <i className="fa-solid fa-circle-plus"></i>
        Add New Article
      </button>
      <br />
      <form>
        <input
          className="form-control"
          placeholder={"Search for Article Title"}
          type="text"
          value={search}
          onChange={handleChange}
        ></input>
      </form>
      <br />
      <br />
      <table className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan="9" className="hcol1">
              Article List
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2">
              <strong>Title</strong>
            </td>
            <td colSpan="1">
              <strong>Author</strong>
            </td>
            <td colSpan="1">
              <strong>Year Published</strong>
            </td>
            <td colSpan="1">
              <strong>Category</strong>
            </td>
            <td colSpan="1">
              <strong>Status</strong>
            </td>
            <td className="dcolbut" colSpan="3"></td>
          </tr>
          {articleData.map(articleMapping)}
        </tbody>
      </table>
      <Popup
        class="viewArticle"
        innerClass="viewArticle-inner"
        trigger={viewTrigger}
        setTrigger={setViewTrigger}
      >
        <ViewArticle article={theArticle} />
      </Popup>
      <Popup
        class="viewArticle"
        innerClass="viewArticle-inner"
        trigger={editTrigger}
        setTrigger={setEditTrigger}
      >
        <EditArticle article={theArticle} />
      </Popup>
    </div>
  );
}

export default ArticleList;
