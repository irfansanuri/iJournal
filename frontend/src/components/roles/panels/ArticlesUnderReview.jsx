import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function ArticlesUnderReview() {
  const [userData, setUserData] = useState([]);
  const [articleData, setArticleData] = useState([]);
  const [reviewerData] = useState([]);

  let email = Cookies.get("email");

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
    axios
      .post("http://localhost:6969/readSpecificUser", {
        email: email
      })
      .then((res) => {
        setArticleData(res.data.articles);
      });
  }, [email]);

  function articleMapping(article) {
    return (
      <table key={article._id} className="tableFull shadow-dreamy">
        <thead>
          <tr>
            <th colSpan="10">Article ID: {article._id}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="leftHeading1">Title</th>
            <td>
              <a href={article.path} target="_blank">{article.title}</a>
            </td>
          </tr>
          <tr>
            <th className="leftHeading2">Status</th>
            <td
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
              {article.status}
            </td>
          </tr>
          <tr>
            <th className="leftHeading1">Field</th>
            <td>{article.field}</td>
          </tr>
          <tr>
            <th className="leftHeading2">Category</th>
            <td>{article.category}</td>
          </tr>
          <tr>
            <th className="leftHeading1">Author</th>
            <td>{article.author}</td>
          </tr>
          {userData.map((each) => {
            if (article.editor === each.email) {
              return (
                <tr>
                  <th className="leftHeading2">Editor</th>
                  <td className="second">
                    {each.fname} {each.lname}
                  </td>
                </tr>
              );
            }
          })}

          {article.reviewer.map((reviewer) => {
            userData.map((user) => {
              if (user.email === reviewer) {
                reviewerData.push(user.fname + " " + user.lname);
              }
            });

            return (
              <tr>
                <th className="leftHeading1">
                  Reviewer {article.reviewer.indexOf(reviewer) + 1}
                </th>
                <td>{reviewerData[article.reviewer.indexOf(reviewer)]}</td>
              </tr>
            );
          })}

          <tr>
            <th className="leftHeading2">Year Published</th>
            <td>{article.year}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return <div className="underReview">{articleData.map(articleMapping)}</div>;
}

export default ArticlesUnderReview;
