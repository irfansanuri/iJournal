import axios from "axios";
import React, { useEffect, useState } from "react";

function ViewArticle(props) {
  const [userData, setUserData] = useState([]);
  const [article] = useState(props.article);
  const [reviewerData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:6969/userData").then((res) => {
      setUserData(res.data);
    });
  }, []);

  return (
    <div>
      <i
        className="fa-solid fa-book"
        style={{ color: "#f67280", fontSize: "130px" }}
      ></i>
      <br />
      <br />
      <br />
      <table className="articleDetails">
        <tbody>
          <tr>
            <td className="first">Status</td>
            <td
              className="second"
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
            <td className="first">Article ID</td>
            <td className="second">{article._id}</td>
          </tr>
          <tr>
            <td className="first">Title</td>
            <td className="second">
              <a href={article.path} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </td>
          </tr>
          <tr>
            <td className="first">Author</td>
            <td className="second">{article.author}</td>
          </tr>

          {userData.map((each) => {
            if (article.editor === each.email) {
              return (
                <tr>
                  <td className="first">Editor</td>
                  <td className="second">
                    {each.fname} {each.lname}
                  </td>
                </tr>
              );
            }
          })}
          <tr>
            <td className="first">
              Reviewer
              {/* {article.reviewer.indexOf(reviewer) + 1} */}
            </td>
            <td className="second">
              {article.reviewer.map((reviewer) => {
                userData.map((user) => {
                  if (user.email === reviewer) {
                    reviewerData.push(user.fname + " " + user.lname);
                  }
                });

                return (
                  <div style={{ display: "inline" }}>
                    {reviewerData[article.reviewer.indexOf(reviewer)] + ", "}
                  </div>
                );
              })}
            </td>
          </tr>
          <tr>
            <td className="first">Published Year</td>
            <td className="second">{article.year}</td>
          </tr>
          <tr>
            <td className="first">Field</td>
            <td className="second">{article.field}</td>
          </tr>
          <tr>
            <td className="first">Category</td>
            <td className="second">{article.category}</td>
          </tr>
          {article.dateline ? (
            <tr>
              <td className="first">Dateline</td>
              <td className="second">
                {article.dateline.substring(8, 10)}-
                {article.dateline.substring(5, 7)}-
                {article.dateline.substring(0, 4)}
              </td>
            </tr>
          ) : (
            <div></div>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewArticle;
