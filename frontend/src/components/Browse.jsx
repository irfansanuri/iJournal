import axios from "axios";
import React, { useEffect, useState } from "react";

function Browse() {
  const [search, setSearch] = useState("");
  const [articleData, setArticleData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:6969/readArticle").then((res) => {
      setArticleData(res.data.articles);
    });
  }, []);

  function handleChange(e) {
    setSearch(e.target.value);
  }

  function articleMapping(article) {
    let lowTitle = article.title.toLowerCase();
    let lowSearch = search.toLowerCase();

    if (article.status === "Published") {
      if (lowTitle.includes(lowSearch)) {
        return (
          <tr key={article._id}>
            <td colSpan="2">
              <a href={article.path} target="_blank" rel="noreferrer">
                {article.title.substring(0, 50)}
              </a>{" "}
            </td>
            <td colSpan="1">{article.author}</td>
            <td colSpan="1">{article.year}</td>
            <td colSpan="1">{article.field}</td>
            <td colSpan="1">{article.category} &nbsp;</td>
          </tr>
        );
      }
    }
  }

  return (
    <div className="browse">
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
              <strong>Field</strong>
            </td>
            <td colSpan="1">
              <strong>Category</strong>
            </td>
          </tr>
          {articleData.map(articleMapping)}
        </tbody>
      </table>
    </div>
  );
}

export default Browse;